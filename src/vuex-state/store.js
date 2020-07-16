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
        state.minions = minions.map(x => new Baddie(x.name, null, null, x.types, 'minions', x.acted))
      }
      if (lieutenants) {
        state.lieutenants = lieutenants.map(x => new Baddie(x.name, null, null, x.types, 'lieutenants', x.acted))
      }
      if (villains) {
        state.villains = villains.map(x => new Villain(x.name, x.bonuses, x.penalties, x.defends, x.acted))
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
    },
    RESET_SCENE(state) {
      state.minions = [];
      state.lieutenants = [];
      state.villains = [];
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
    resetScene(ctx) {
      ctx.commit('RESET_SCENE');
      ctx.displatch('saveBaddies', 'minions');
      ctx.displatch('saveBaddies', 'lieutenants');
      ctx.displatch('saveBaddies', 'villains');
    }
  },
  getters: {

  }
})

export default store;