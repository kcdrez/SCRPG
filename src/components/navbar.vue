<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link :to="{name: 'home'}"
                 class="navbar-brand">Home</router-link>
    <button class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar-toggler">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse"
         id="navbar-toggler">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <div class="nav-link c-pointer"
               data-toggle="modal"
               data-target="#overcomeChartModal">Overcome Chart</div>
        </li>
        <li class="nav-item">
          <div class="nav-link c-pointer"
               data-toggle="modal"
               data-target="#boostsChartModal">Boost/Hinder Chart</div>
        </li>
      </ul>
    </div>
    <div class="navbar-text">
      <small>Version: {{version}}</small>
    </div>
  </nav>
</template>

<script>
  import {version} from '../../package.json';

  export default {
    name: 'NavBar',
    data() {
      return {
        version
      }
    }
  };
</script>

<style lang="scss" scoped>
  nav {
    position: sticky;
    top: 0;
    z-index: 5;
  }
</style>