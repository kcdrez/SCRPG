import { createApp } from "vue";
import "bootstrap";
import "./styles/main.scss";

import App from "./App.vue";
import store from "./vuex-state/store";
import router from "./router/router";

const app = createApp(App);

app.use(router).use(store).mount("#app");
