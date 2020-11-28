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

//todo: set up type safety for the store
// declare module "vue/types/vue" {
//   interface Vue {
//     $vstore: Store<State>
//   }
// }

// const typedStorePlugin = {
//   install(VueInstance: typeof Vue) {
//     Object.defineProperty(VueInstance.prototype, '$vstore', {
//         get() {
//           return this.$store;
//         }
//     });
//   }
// };

// Vue.use(Vuex);
// Vue.use(typedStorePlugin);

export default store;