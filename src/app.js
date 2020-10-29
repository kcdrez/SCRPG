import Vue from 'vue';
import 'bootstrap/dist/js/bootstrap.min.js';
import './styles/main.scss';
import formWizard from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import VueDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import '@fortawesome/fontawesome-free/js/all.js';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';


import store from './vuex-state/store';
import router from './router/router';
import navbar from './components/navbar.vue';

Vue.component('navbar', navbar);
Vue.component('icon', FontAwesomeIcon);

Vue.use(formWizard);
Vue.use(VueDialog);

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