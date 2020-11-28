import { GetterTree } from 'vuex';
import { State } from './state';
import { Actor, sortActors} from '../scripts/actor';

const getters: GetterTree<State, any> = {
    byID: state => (id: string) => {
      return [
        ...state.players, 
        ...state.villains, 
        ...state.minions,
        ...state.lieutenants,
        state.scene].find(entry => entry?.id === id);
    },
    childMinions: state => (id: string) => {
      return state.minions.filter(minion => minion.owner && minion.owner.id === id);
    },
    actors: state => {
      let arr: Actor[] = [];
      if (state.scene?.name) arr.push(state.scene);

      const envMinions = state.minions.filter(m => m.owner ? m.owner.id === state.scene?.id : false);
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

export default getters;