import { createApp, createVNode, render, ref } from "vue";
import * as ConfirmDialog from "vuejs-confirm-dialog";

import "bootstrap";
import "./styles/main.scss";

import App from "./App.vue";
import store from "./vuex-state/store";
import router from "./router/router";
import dialog from "./scripts/dialog";

const app = createApp(App);

app.config.globalProperties.$dialog = dialog;

app.use(router).use(store).use(ConfirmDialog).mount("#app");
