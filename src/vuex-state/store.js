import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import {Baddie, Villain} from '../scripts/baddie';
import {unvue} from '../scripts/utilities';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    initialized: false,
    lieutenants: [],
    minions: [],
    villains: []
  },
  mutations: {
    INIT(state, payload) {
      const minions = Cookies.getJSON('minions');
      const lieutenants = Cookies.getJSON('lieutenants');
      const villains = Cookies.getJSON('villains');
      if (minions) {
        state.minions = minions.map(x => new Baddie(x.name, null, null, x.types, 'minions'))
      }
      if (lieutenants) {
        state.lieutenants = lieutenants.map(x => new Baddie(x.name, null, null, x.types, 'lieutenants'))
      }
      if (villains) {
        state.villains = villains.map(x => new Villain(x.name, x.bonuses, x.penalties))
      }           
      state.initialized = true;
    },
    UPSERT_BADDIE(state, {baddie, baddieType}) {
      const match = state[baddieType].find(x => x.name === baddie.name);
      if (match && baddieType !== 'villains') {
        Object.entries(baddie.types).forEach(([size, list]) => {
          list.forEach(item => {
            match.addBaddie(size, item.bonuses, item.penalties, item.count);
          })
        })
      } else {
        state[baddieType].push(baddie);
      }
      Cookies.set(baddieType, state[baddieType]);
    },
    DELETE_BADDIE(state, {type, index}) {
      state[type].splice(index, 1);
      Cookies.set(type, state[type]);
    }
  },
  actions: {
    async initialize(ctx) {
      if (!ctx.state.initialized) {
        ctx.commit('INIT');
      }
    },
    saveBaddies(ctx, baddieType) {
      Cookies.set(baddieType, ctx.rootState[baddieType]);
    },
    addBaddieAffix(ctx, {affixData, baddieType}) {
      const {amount, name, type, target, size, index} = affixData;
      if (name === '') return;
      else if (type === 'Bonus') {
        target.boost(name, amount, size, index);
      } else {
        target.hinder(name, amount, size, index);
      }
      // ctx.dispatch('refreshBaddies', {size, baddieType, baddie: target});
    },
    // refreshBaddies(ctx, {baddieType, size, baddie}) {
    //   if (baddieType !== 'villains') {
    //     baddie.types[size] = unvue(baddie.types[size]).reduce((acc, el) => {
    //       const match = acc.find(x => {
    //         return JSON.stringify(x.bonuses) === JSON.stringify(el.bonuses) &&
    //           JSON.stringify(x.penalties) === JSON.stringify(el.penalties);
    //       });
    //       if (match) {
    //         match.count += el.count;
    //       } else {
    //         acc.push(el);
    //       }
    //       return acc;
    //     }, []);
    //   }
    //   ctx.dispatch('saveBaddies', baddieType);
    // },
    removeAffix(ctx, {baddieType, baddie, size, baddieIndex, affixIndex, type}) {
      if (baddieType === 'villains') { //todo: make this a function in the class
        baddie[type].splice(affixIndex, 1);
      } else {
        baddie.types[size][baddieIndex][type].splice(affixIndex, 1);
      }
      baddie.refresh(size);
      // ctx.dispatch('refreshBaddies', {size, baddieType, baddie});
    }
  },
  getters: {

  }
})

export default store;