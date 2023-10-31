import { createRouter, createWebHashHistory } from "vue-router";

import GMToolsPage from "../pages/gmTools.vue";

import store from "../vuex-state/store";

const routes = [
  {
    path: "/",
    name: "home",
    component: GMToolsPage,
  },
  {
    path: "/gmtools",
    name: "gmTools",
    component: GMToolsPage,
  },
];

// const router = new VueRouter({
//   // mode: 'history',
//   routes
// });

// router.beforeEach((to, from, next) => {
//   isInitialized(next);
// });

// function isInitialized(next) {
//   if (store.state.initialized) next();
//   else {
//     store.watch(
//       (state) => state.initialized,
//       (newVal) => { if (newVal) next() }
//     )
//   }
// }
// export default router;

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
