import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import xlsx from 'xlsx';
import {Baddie, Villain} from '../scripts/baddie';
import {Player} from '../scripts/player';
import {Scene} from '../scripts/scene';
import {unvue} from '../scripts/utilities';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    initialized: false,
    lieutenants: [],
    minions: [],
    villains: [],
    players: [],
    scene: null
  },
  mutations: {
    INIT(state) {
      const minions = Cookies.getJSON('minions');
      const lieutenants = Cookies.getJSON('lieutenants');
      const villains = Cookies.getJSON('villains');
      const playerData = Cookies.getJSON('players');
      const sceneData = Cookies.getJSON('scene');
      if (playerData) {
        state.players = playerData.map(x => new Player(x));
      }
      if (minions) {
        state.minions = minions.map(x => new Baddie(x, 'minions'));
      }
      if (lieutenants) {
        state.lieutenants = lieutenants.map(x => new Baddie(x, 'lieutenants'));
      }
      if (villains) {
        state.villains = villains.map(x => new Villain(x));
      }
      state.scene = new Scene(sceneData || {});
      state.initialized = true;
    },
    UPSERT_BADDIE(state, baddie) {
      const match = state[baddie.type].find(x => x.id === baddie.id);
      if (match && baddie.type !== 'villains') {
        baddie.list.forEach(x => match.addBaddie(x));
      } else {
        state[baddie.type].push(baddie);
      }
    },
    DELETE_BADDIE(state, {baddieType, index, baddie}) {
      if (baddie !== undefined) {
        index = state[baddieType].findIndex(x => x.name === baddie.name);
      } 
      if (index > -1) {
        state[baddieType].splice(index, 1);
        Cookies.set(baddieType, state[baddieType]);
      }
    },
    RESET_SCENE(state) {
      state.minions = [];
      state.lieutenants = [];
      state.villains = [];
      state.scene.clear();
    },
    RESET_ROUND(state) {
      state.minions.forEach(x => x.resetRound());
      state.lieutenants.forEach(x => x.resetRound());
      state.villains.forEach(x => x.resetRound());
      state.players.forEach(x => x.resetRound());
      state.scene.resetRound();
    },
    ADD_PLAYER(state, playerData) {
      state.players.push(new Player(playerData));
    },
    REMOVE_PLAYER(state, name) {
      const index = state.players.findIndex(x => x.name === name);
      if (index > -1) {
        state.players.splice(index, 1);
      }
    },
    RESET_PLAYERS(state) {
      state.players = [];
    }
  },
  actions: {
    async initialize(ctx) {
      if (!ctx.state.initialized) {
        ctx.commit('INIT');
      }
    },
    saveData(ctx, dataType) {
      Cookies.set(dataType, ctx.rootState[dataType]); 
    },
    resetScene(ctx) {
      ctx.commit('RESET_SCENE');
      ctx.dispatch('saveData', 'minions');
      ctx.dispatch('saveData', 'lieutenants');
      ctx.dispatch('saveData', 'villains');
      ctx.dispatch('saveData', 'scene');
    },
    resetRound(ctx) {
      ctx.commit('RESET_ROUND');
    },
    upsertBaddie(ctx, baddieData) {
      let baddie;
      if (baddieData.type === 'villain') baddie = new Villain(baddieData);
      else baddie = new Baddie(baddieData);
      ctx.commit('UPSERT_BADDIE', baddie);
      ctx.dispatch('saveData', baddieData.type);
    },
    addPlayer(ctx, playerData) {
      if (!ctx.state.players.find(x => x.id === playerData.id)) {
        ctx.commit('ADD_PLAYER', playerData);
        ctx.dispatch('saveData', 'players');
      }
    },
    removePlayer(ctx, name) {
      ctx.commit('REMOVE_PLAYER', name);
      ctx.dispatch('saveData', 'players');
    },
    resetPlayers(ctx) {
      ctx.commit('RESET_PLAYERS');
      ctx.dispatch('saveData', 'players'); 
    },
    export(ctx) {
      const players = ctx.state.players.map(x => x.export());
      const {scene, challenges, locations} = ctx.state.scene.export();
      const minions = ctx.getters.exportBaddie(ctx.state.minions);
      const lieutenants = ctx.getters.exportBaddie(ctx.state.lieutenants);
      const villains = ctx.getters.exportBaddie(ctx.state.villains);

      const wb = xlsx.utils.book_new();
      const sceneWS = xlsx.utils.json_to_sheet([
        ...players, 
        ...scene, 
        ...challenges, 
        ...locations,
        ...minions.baddies,
        ...minions.list,
        ...minions.modifiers,
        ...lieutenants.baddies,
        ...lieutenants.list,
        ...lieutenants.modifiers,
        ...villains.baddies,
        ...villains.modifiers
      ]);

      xlsx.utils.book_append_sheet(wb, sceneWS, "SCRPG");

      xlsx.writeFile(wb, 'SCRPG-GM.xlsx');
    },
    import(ctx, files) {
      ctx.dispatch('resetScene');
      for (let i = 0; i < files.length; i++) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const bytes = new Uint8Array(e.target.result);
          let binary = "";
          for (let j = 0; j < bytes.byteLength; j++) {
            binary += String.fromCharCode(bytes[j]);
          }
          const wb = xlsx.read(binary, {type: 'binary'});
          wb.SheetNames.forEach(sheetName => {
            xlsx.utils.sheet_to_json(wb.Sheets[sheetName]).forEach(row => {
              if (!row.type) return;
              switch (row.type.toLowerCase()) {
                case 'player':
                case 'players':
                  ctx.dispatch('addPlayer', row);
                  break;
                case 'scene':
                case 'environment':
                  ctx.state.scene.import(row);
                  break;
                case 'minion':
                case 'minions':
                  ctx.displatch('upsertBaddie', row);
                  break;
                case 'minions element': 
                case 'lieutenants element': {
                  const minionMatch = ctx.state.minions.find(x => x.id === row.parent);
                  const lieutenantMatch = ctx.state.lieutenants.find(x => x.id === row.parent);
                  if (minionMatch) minionMatch.addBaddie(row);
                  if (lieutenantMatch) lieutenantMatch.addBaddie(row);
                  break;
                }
                case 'lieutenant':
                case 'lieutenants':
                  ctx.displatch('upsertBaddie', row);
                  break;
                case 'villain':
                case 'villains':
                  ctx.displatch('upsertBaddie', row);
                  break;
                case 'challenge':
                  ctx.state.scene.addChallenge(row, true);
                  break;
                case 'challenge element':
                  const challenge = ctx.state.scene.challenges.find(x => x.id === row.parent);
                  if (challenge) challenge.add(row);
                  break;
                case 'location':
                  ctx.state.scene.addLocation(row);
                  break;
                case 'bonus': 
                case 'penalty':
                case 'defend': {
                  let baddie = null;
                  let baddieData = null;
                  ctx.state.minions.forEach(x => {
                    baddieData = x.findChild(row.parent);
                    if (baddieData) baddie = x;
                  });
                  if (!baddie) {
                    ctx.state.lieutenants.forEach(x => {
                      baddieData = x.findChild(row.parent);
                      if (baddieData) baddie = x;
                    });
                  }
                  if (!baddie) {
                    baddie = ctx.state.villains.find(x => x.id === row.parent);
                  }
                  if (baddie) {
                    baddie.addModifier(row, baddieData);
                  } 
                  break;
                }
              }
            });
          });
        }
        fileReader.readAsArrayBuffer(files[i]);
      }
    }
  },
  getters: {
    byID: state => id => {
      return [...state.players, ...state.villains, state.scene].find(entry => entry.id === id);
    },
    childMinions: state => id => {
      return state.minions.filter(minion => minion.owner && minion.owner.id === id);
    },
    actors: state => {
      const envMinions = state.minions.filter(m => m.owner ? m.owner.id === state.scene.id : false);
      let arr = [state.scene, ...envMinions];
      state.players.sort((a, b) => a.name > b.name).forEach(player => {
        arr.push(player);
        const minions = state.minions.filter(m => m.owner ? m.owner.id === player.id : false);
        arr = arr.concat(minions);
      });
      state.villains.sort((a, b) => a.name > b.name).forEach(villain => {
        arr.push(villain);
        const minions = state.minions.filter(m => m.owner ? m.owner.id === villain.id : false);
        arr = arr.concat(minions);
      });
      const remainingMinions = state.minions.filter(m => {
        const match = arr.find(x => x.id === m.id);
        return !match;
      });

      return arr.concat(state.lieutenants, remainingMinions);
    },
    exportBaddie: state => baddieList => {
      return baddieList.reduce((acc, x) => {
        const {baddie, list, modifiers} = x.export();
        acc.baddies.push(baddie);
        if (list) acc.list = acc.list.concat(list);
        acc.modifiers = acc.modifiers.concat(modifiers);
        return acc;
      }, { baddies: [], list: [], modifiers: [] });
    }
  }
})

export default store;