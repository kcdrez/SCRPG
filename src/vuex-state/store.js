import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    initialized: false
  },
  mutations: {
    INIT(state, payload) {
      state.initialized = true;
    }
  },
  actions: {
    async initialize(ctx) {
      if (!ctx.state.initialized) {
        ctx.commit('INIT');
      }
    }
  },
  getters: {

  }
})

export default store;