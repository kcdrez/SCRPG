import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import Cookies from 'js-cookie';
import xlsx from 'xlsx';
import { Baddie, BaddieData, Villain, VillainData, sameBaddies, BaddieParent, ModifierData } from '../scripts/baddie';
import { Player, PlayerData } from '../scripts/player';
import { Scene, SceneData} from '../scripts/scene';
import { Actor, sortActors } from '../scripts/actor';
import { unvue, processXlsxFiles } from '../scripts/utilities';
import { v4 as uuid } from 'uuid';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
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
      const minions: BaddieData[] | null = Cookies.getJSON('minions');
      const lieutenants: BaddieData[] | null = Cookies.getJSON('lieutenants');
      const villains: VillainData[] | null = Cookies.getJSON('villains');
      const playerData: PlayerData[] | null = Cookies.getJSON('players');
      const sceneData: SceneData | null = Cookies.getJSON('scene');
      state.players = playerData?.map(x => new Player(x)) || [];
      state.minions = minions?.map(x => new Baddie(x)) || [];
      state.lieutenants = lieutenants?.map(x => new Baddie(x)) || [];
      state.villains = villains?.map(x => new Villain(x)) || [];
      state.scene = new Scene(sceneData || {id: uuid(), name: null});
      state.initialized = true;
    },
    CREATE_BADDIE(state, baddie: Baddie) {
      if (baddie.type === 'minions' || baddie.type === 'lieutenants') {
        state[baddie.type].push(baddie);
      }
    },
    CREATE_Villain(state, villain: Villain) {
      state.villains.push(villain);
    },
    UPSERT_BADDIE(state, baddie: Baddie) {
      if (baddie.type === 'minions' || baddie.type === 'lieutenants') {
        const match = state[baddie.type].find(x => sameBaddies(baddie, x));
        if (match) {
          match.count++;
        } else {
          state[baddie.type].push(baddie);
        }
      }
    },
    UPSERT_VILLAIN(state, villain: Villain) {
      state.villains.push(villain);
    },
    DELETE_BADDIE(state, {type, index}: { type: string, index: number}) {
      if (type === 'minions' || type === 'lieutenants' || type === 'villains') {
        state[type].splice(index, 1);
      }
    },
    RESET_SCENE(state) {
      state.minions = [];
      state.lieutenants = [];
      state.villains = [];
      state.scene?.clear();
    },
    RESET_ROUND(state) {
      state.minions.forEach(x => x.resetRound());
      state.lieutenants.forEach(x => x.resetRound());
      state.villains.forEach(x => x.resetRound());
      state.players.forEach(x => x.resetRound());
      state.scene?.resetRound();
    },
    ADD_PLAYER(state, playerData: PlayerData) {
      state.players.push(new Player(playerData));
    },
    REMOVE_PLAYER(state, id: string) {
      const index = state.players.findIndex(x => x.id === id);
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
    saveData(ctx, dataType: string) {
      switch (dataType) {
        case 'minions':
        case 'lieutenants':
        case 'villains':
        case 'players':
        case 'scene':
          Cookies.set(dataType, ctx.rootState[dataType] || {}, {sameSite: 'strict'});
          break;
        default:
          console.warn(`Unable to save the data for ${dataType}.`);
      }
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
    upsertBaddie(ctx, baddieData: BaddieData | VillainData) {
      if ('forceCreate' in baddieData && (baddieData.type === 'minions' || baddieData.type === 'lieutenants')) {
        if (baddieData.forceCreate) {
          ctx.commit('CREATE_BADDIE', new Baddie(baddieData));
        } else {
          ctx.commit('UPSERT_BADDIE', new Baddie(baddieData));
        }
      } else if (baddieData.type === 'villains') {
        ctx.commit('UPSERT_VILLAIN', new Villain(baddieData));
      } else {
        console.warn(`Cannot upsert data of type: ${baddieData.type}`);
      }
      ctx.dispatch('saveData', baddieData.type);
    },
    modifyBaddie(ctx, {modifier, type}: {modifier: ModifierData, type: string}) {
      let match: BaddieParent | undefined;
      if (type === 'minions' ) {
        match = ctx.state.minions.find(minion => minion.id === modifier.target);
        if (match) applyMod(match, ctx.state.minions)
      } else if (type === 'lieutenants') {
        match = ctx.state.lieutenants.find(lieutenant => lieutenant.id === modifier.target);
      } else if (type === 'villains') {
        match = ctx.state.villains.find(villain => villain.id === modifier.target);
      }

      

      function applyMod(baddie: BaddieParent, list: BaddieParent[]) {
        if (modifier.applyTo === 'row') {
          baddie.addModifier(modifier);
        } else if (modifier.applyTo === 'name') {
          list.forEach(x => {
            if (x.name === baddie.name) {
              x.addModifier(modifier);
            }
          });
        } else {
          const copy = baddie.copy();
          copy.id = uuid();
          if (baddie.type === 'minions' || baddie.type === 'lieutenants') {
            copy.count = modifier.applyTo === 'single' ? 1 : baddie.count;
            baddie.count--;
            const newBaddie = new Baddie(copy);
            newBaddie.addModifier(modifier);
            ctx.commit('UPSERT_BADDIE', newBaddie);
          } else if (baddie.type === 'villains') {
            const newBaddie = new Baddie(copy);
            newBaddie.addModifier(modifier);
            ctx.commit('UPSERT_VILLAIN', newBaddie);
          }
        }
        ctx.dispatch('saveData', type);
      }
      
      if (match) {
      }
    },
    removeBaddie(ctx, {id, type}) {
      const index = ctx.state[type].findIndex(x => x.id === id);
      if (index >= 0) { 
        ctx.commit('DELETE_BADDIE', {type, index});
        ctx.dispatch('saveData', type);
      }
    },
    addPlayer(ctx, playerData) {
      if (!ctx.state.players.find(x => x.id === playerData.id)) {
        ctx.commit('ADD_PLAYER', playerData);
        ctx.dispatch('saveData', 'players');
      }
    },
    removePlayer(ctx, id) {
      ctx.commit('REMOVE_PLAYER', id);
      ctx.dispatch('saveData', 'players');
    },
    resetPlayers(ctx) {
      ctx.commit('RESET_PLAYERS');
      ctx.dispatch('saveData', 'players'); 
    },
    reconcile(ctx, type) {
      for (let i = 0; i < ctx.state[type].length - 1; i++) {
        if (sameBaddies(ctx.state[type][i], ctx.state[type][i+1])) {
          ctx.state[type][i].count += ctx.state[type][i+1].count;
          ctx.state[type][i+1].markForDeath = true;
        }
      }
      ctx.state[type] = ctx.state[type].filter(x => !x.markForDeath);
    },
    export(ctx, options) {
      const {type, fileName, id} = options || {};
      const rows = [];
      const {scene, challenges, locations, envMinions} = ctx.state.scene.export(id);
      if (type === 'scene' || !type) {
        if (scene) rows.push(scene);
        rows.push(...envMinions);
      }
      if (type === 'challenges' || !type) {
        rows.push(...challenges);
      }
      if (type === 'locations' || !type) {
        rows.push(...locations);
      }
      if (type === 'players' || !type) {
        ctx.state.players.forEach(x => {
          const {player, minions} = x.export();
          rows.push(player, ...minions.filter(minion => {
            return !rows.find(row => row.id === minion.id);
          }));
        });
      }
      if (type === 'villains' || !type) {
        ctx.state.villains.forEach(x => {
          const {baddie, modifiers, minions} = x.export();
          rows.push(baddie, ...modifiers, ...minions.filter(minion => {
            return !rows.find(row => row.id === minion.id);
          }));
        });
      }
      if (type === 'lieutenants' || !type) {
        ctx.state.lieutenants.forEach(x => {
          const {baddie, modifiers} = x.export();
          rows.push(baddie, ...modifiers);
        });
      }
      if (type === 'minions' || !type) {
        ctx.state.minions.forEach(minion => {
          if (!rows.find(row => row.id === minion.id)) {
            const {baddie, modifiers} = minion.export();
            rows.push(baddie, ...modifiers);
          }
        });
      }
      console.log(rows);
      
      const wb = xlsx.utils.book_new();
      const sceneWS = xlsx.utils.json_to_sheet(rows);

      xlsx.utils.book_append_sheet(wb, sceneWS, "SCRPG");

      xlsx.writeFile(wb, (fileName || 'SCRPG-GM') + '.xlsx');
    },
    async import(ctx, data) {
      const {files, filters} = data;
      if (!files) return;
      (await processXlsxFiles(files, filters)).forEach(row => {
        // console.log(row);
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
          case 'lieutenant':
          case 'lieutenants':
          case 'villain':
          case 'villains':
            ctx.dispatch('upsertBaddie', Object.assign({forceCreate: true}, row));
            break;
          case 'challenge':
            ctx.state.scene.addChallenge(row, true);
            break;
          case 'challenge element':
            const challenge = ctx.state.scene.challenges.find(x => x.id === row.parent);
            if (challenge) challenge.add(row);
            else {
              console.warn('Could not find the challenge parent for: ', row);
            }
            break;
          case 'location':
            ctx.state.scene.addLocation(row);
            break;
          case 'bonus': 
          case 'penalty':
          case 'defend': {
            const baddie = ctx.getters.byID(row.parent);
            if (baddie) {
              baddie.addModifier(row);
            } else {
              console.warn('Could not find the baddie parent for: ', row);
            }
            break;
          }
        }
      });
    }
  },
  getters: {
    byID: state => id => {
      return [
        ...state.players, 
        ...state.villains, 
        ...state.minions,
        ...state.lieutenants,
        state.scene].find(entry => entry.id === id);
    },
    childMinions: state => id => {
      return state.minions.filter(minion => minion.owner && minion.owner.id === id);
    },
    actors: state => {
      let arr: Actor[] = [];
      if (state.scene?.name) arr.push(state.scene);

      const envMinions = state.minions.filter(m => m.owner ? m.owner.id === state.scene.id : false);
      arr.push(...envMinions);

      state.players.sort(sortActors).forEach(player => {
        arr.push(player);
        const minions = state.minions.filter(m => m.owner ? m.owner.id === player.id : false);
        arr = arr.concat(minions);
      });

      state.villains.sort(sortActors).forEach(villain => {
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
};

interface RootState {
  initialized: boolean,
  lieutenants: Baddie[],
  minions: Baddie[],
  villains: Villain[],
  players: Player[],
  scene: null | Scene
}

export default store;