import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { State, state } from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});

//Sets up usage for vstore
declare module "vue/types/vue" {
  interface Vue {
    $vstore: Store<State>,
    dialog: () => {

    }
  }
}

//sets up that vstore returns store essentially creating an alias
const typedStorePlugin = {
  install(VueInstance: typeof Vue) {
    Object.defineProperty(VueInstance.prototype, '$vstore', {
        get() {
          return this.$store;
        }
    });
  }
};

// Vue.use(Vuex);
Vue.use(typedStorePlugin);

export default store;