import Vue from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// import './styles/main.scss';

import store from './vuex-state/store';
import router from './router/router';
// import navbar from './components/navbar.vue';

// Vue.component('navbar', navbar);

const app = new Vue({
  el: '#app',
  template: `<div>
    <router-view></router-view>
  </div>`,
  store,
  router,
  created() {
    store.dispatch('initialize');
  }
})