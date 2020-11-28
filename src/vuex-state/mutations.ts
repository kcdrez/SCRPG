import { MutationTree } from 'vuex';
import { State } from './state';

import { Baddie, BaddieData, Villain, VillainData, sameBaddies } from '../scripts/baddie';
import { Player, PlayerData } from '../scripts/player';
import { Scene, SceneData } from '../scripts/scene';

const mutations = <MutationTree<State>> {
    INIT(state, payload: {players: PlayerData[], minions: BaddieData[], lieutenants: BaddieData[], villains: VillainData[], scene: SceneData}) {
      state.players = payload.players?.map(x => new Player(x)) || [];
      state.minions = payload.minions?.map(x => new Baddie(x)) || [];
      state.lieutenants = payload.lieutenants?.map(x => new Baddie(x)) || [];
      state.villains = payload.villains?.map(x => new Villain(x)) || [];
      state.scene = new Scene(payload.scene);
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
}

export default mutations;