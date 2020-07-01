import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import HomePage from '../pages/home.vue';
import AdminPage from '../pages/admin.vue';

import store from '../vuex-state/store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage
  }  
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  isInitialized(next);
})

function isInitialized(next) {
  if (store.state.initialized) next();
  else {
    store.watch(
      (state) => state.initialized,
      (newVal) => { if (newVal) next() }
    )
  }
}
export default router;