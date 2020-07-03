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
        state.minions = minions.map(x => new Baddie(x.name, null, null, x.types))
      }
      if (lieutenants) {
        state.lieutenants = lieutenants.map(x => new Baddie(x.name, null, null, x.types))
      }
      if (villains) {
        state.villains = villains.map(x => new Villain(x.name, x.boosts, x.hinders))
      }           
      state.initialized = true;
    },
    UPSERT_BADDIE(state, {baddie, baddieType}) {
      const match = state[baddieType].find(x => x.name === baddie.name);
      if (match && baddieType !== 'villains') {
        Object.entries(baddie.types).forEach(([size, list]) => {
          list.forEach(item => {
            match.addBaddie(size, item.boosts, item.hinders, item.count);
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
      if (type === 'Boost') {
        target.boost(name, amount, size, index);
      } else {
        target.hinder(name, amount, size, index);
      }
      ctx.dispatch('saveBaddies', baddieType);
    },
    removeAffix(ctx, {baddieType, baddie, size, baddieIndex, affixIndex, type}) {
      if (baddieType === 'villains') {
        baddie[type].splice(affixIndex, 1);
      } else {
        let baddieData = baddie.types[size];
        baddieData[baddieIndex][type].splice(affixIndex, 1);

        baddieData = unvue(baddieData).reduce((acc, el) => {
          const match = acc.find(x => {
            return JSON.stringify(x.boosts) === JSON.stringify(el.boosts) &&
              JSON.stringify(x.hinders) === JSON.stringify(el.hinders);
          });
          if (match) {
            match.count += el.count;
          } else {
            acc.push(el);
          }
          return acc;
        }, []);
      }
      ctx.dispatch('saveBaddies', baddieType);
    }
  },
  getters: {

  }
})

export default store;