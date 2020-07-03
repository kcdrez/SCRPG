import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import Minion from '../scripts/minions';
import {unvue} from '../scripts/utilities';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    initialized: false,
    lieutenants: [],
    minions: []
  },
  mutations: {
    INIT(state, payload) {
      const minions = Cookies.getJSON('minion');
      if (minions) {
        state.minions = minions.map(x => new Minion(x.name, null, null, x.types))
      }
      state.initialized = true;
    },
    UPSERT_BADDIE(state, {baddie, baddieType}) {
      const match = state[baddieType].find(x => x.name === baddie.name);
      if (match) {
        Object.entries(baddie.types).forEach(([size, list]) => {
          list.forEach(item => {
            match.addMinion(size, item.boosts, item.hinders, item.count);
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
      const {amount, name, type, target, minionSize, minionIndex} = affixData;
      if (name === '') return;
      if (type === 'Boost') {
        target.boost(minionSize, minionIndex, amount, name);
      } else {
        target.hinder(minionSize, minionIndex, amount, name);
      }
      Cookies.set(baddieType, ctx.rootState[baddieType]);
    },
    demoteBaddie(ctx, {minion, size, index, baddieType}) {
      minion.demote(size, index);
      Cookies.set(baddieType, ctx.rootState[baddieType]);
    },
    removeBaddie(ctx, {minion, size, index, baddieType}) {
      minion.removeMinion(size, index);
      Cookies.set(baddieType, ctx.rootState[baddieType]);
    },
    removeAffix(ctx, {baddieType, minion, size, minionIndex, affixIndex, type}) {
      let minionData = minion.types[size];
      minionData[minionIndex][type].splice(affixIndex, 1);

      minionData = unvue(minionData).reduce((acc, minionEl) => {
        const match = acc.find(x => {
          return JSON.stringify(x.boosts) === JSON.stringify(minionEl.boosts) &&
            JSON.stringify(x.hinders) === JSON.stringify(minionEl.hinders);
        });
        if (match) {
          match.count += minionEl.count;
        } else {
          acc.push(minionEl);
        }
        return acc;
      }, []);
      Cookies.set(type, ctx.rootState[type]);
    }
  },
  getters: {

  }
})

export default store;