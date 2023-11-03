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

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  store.dispatch("initialize");
  next();
});

export default router;
