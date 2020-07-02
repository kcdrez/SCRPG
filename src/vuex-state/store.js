import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import Minion from '../scripts/minions';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    initialized: false,
    minions: [],
    minionData: {
      name: 'Robot',
      size: 8,
      count: 5,
      affix: {
        amount: 0,
        name: '',
        max: 0,
        min: 0,
        type: '',
        minionSize: 0,
        minionIndex: -1,
        target: null
      }
    }
  },
  mutations: {
    INIT(state, payload) {
      const minions = Cookies.getJSON('minion');
      if (minions) {
        state.minions = minions.map(x => new Minion(x.name, null, null, x.types))
      }
      state.initialized = true;
    },
    ADD_AFFIX(state, {max, min, amount, type, minion, size, index}) {
      state.minionData.affix.max = max;
      state.minionData.affix.min = min;
      state.minionData.affix.amount = amount;
      state.minionData.affix.type = type;
      state.minionData.affix.target = minion;
      state.minionData.affix.minionSize = size;
      state.minionData.affix.minionIndex = index;
      $('#affixMinionModal').modal('show');
    },
    ADD_MINION(state, minion) {
      state.minions.push(minion);
      Cookies.set('minion', state.minions);
    },
    DELETE_MINION(state, index) {
      state.minions.splice(index, 1);
      Cookies.set('minion', state.minions);
    }
  },
  actions: {
    async initialize(ctx) {
      if (!ctx.state.initialized) {
        ctx.commit('INIT');
      }
    },
    boostMinion(ctx, data) {
      ctx.commit('ADD_AFFIX', Object.assign({
        max: 4, 
        min: 1,
        amount: 1,
        type: 'Boost',}, data));
    },
    hinderMinion(ctx, data) {
      ctx.commit('ADD_AFFIX', Object.assign({
        max: -1, 
        min: -4,
        amount: -1,
        type: 'Hinder',}, data));
    },
    addMinionAffix(ctx) {
      const {amount, name, type, target, minionSize, minionIndex} = ctx.rootState.minionData.affix;
      if (name === '') return;
      if (type === 'Boost') {
        target.boost(minionSize, minionIndex, amount, name);
      } else {
        target.hinder(minionSize, minionIndex, amount, name);
      }
      Cookies.set('minion', ctx.rootState.minions);
    },
    demoteMinion(ctx, {minion, size, index}) {
      minion.demote(size, index);
      Cookies.set('minion', ctx.rootState.minions);
    },
    removeMinion(ctx, {minion, size, index}) {
      minion.removeMinion(size, index)
      Cookies.set('minion', ctx.rootState.minions);
    },    
    removeAffix(ctx, {minion, index, type}) {
      minion[type].splice(index, 1);
      Cookies.set('minion', ctx.rootState.minions);
    }
  },
  getters: {

  }
})

export default store;