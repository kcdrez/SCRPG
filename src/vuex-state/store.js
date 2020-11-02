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
    UPSERT_BADDIE(state, {baddie, baddieType}) {
      const match = state[baddieType].find(x => x.name === baddie.name);
      if (match && baddieType !== 'villains') {
        baddie.list.forEach(x => match.addBaddie(x));
      } else {
        state[baddieType].push(baddie);
      }
      Cookies.set(baddieType, state[baddieType]);
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
    addPlayer(ctx, playerData) {
      ctx.commit('ADD_PLAYER', playerData);
      ctx.dispatch('saveData', 'players');
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
      const wb = xlsx.utils.book_new();
      const playersWorksheet = xlsx.utils.json_to_sheet(ctx.state.players.map(x => x.export()));
      const sceneWorksheet = xlsx.utils.json_to_sheet(ctx.scene.export());
      const challengeWorksheet = xlsx.utils.json_to_sheet(ctx.scene.exportChallenges());
      const challengeElementsWorksheet = xlsx.utils.json_to_sheet(ctx.scene.exportChallengeElements());

      xlsx.utils.book_append_sheet(wb, playersWorkSheet, "players");
      xlsx.utils.book_append_sheet(wb, playersWorkSheet, "scene");

      xlsx.writeFile(wb, 'test.xlsx');
    },
    import(ctx, files) {
      for (let i = 0; i < files.length; i++) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const bytes = new Uint8Array(e.target.result);
          let binary = "";
          for (let j = 0; j < bytes.byteLength; j++) {
            binary += String.fromCharCode(bytes[j]);
          }
          const wb = xlsx.read(binary, {type: 'binary'});
          const sheetNames = wb.SheetNames;
          wb.SheetNames.forEach(sheetName => {
            xlsx.utils.sheet_to_json(wb.Sheets[sheetName]).forEach(row => {
              switch (sheetName.toLowerCase()) {
                case 'player':
                case 'players':
                  ctx.commit('ADD_PLAYER', row);
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
    }
  }
})

export default store;