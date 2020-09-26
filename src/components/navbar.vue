<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link :to="{name: 'home'}" class="navbar-brand">Home</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-toggler" aria-controls="navbar-toggler" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbar-toggler">
      <ul class="navbar-nav mr-auto">
        <!-- <li class="nav-item">
          <router-link :to="{name: 'characterCreation'}" class="nav-link">Character Creation</router-link>
        </li> -->
        <li class="nav-item">
          <router-link :to="{name: 'gmTools'}" class="nav-link">GM Tools</router-link>
        </li>
        <li class="nav-item">
          <div class="nav-link c-pointer" data-toggle="modal" data-target="#overcomeChartModal">Overcome Chart</div>
        </li>
        <li class="nav-item">
          <div class="nav-link c-pointer" data-toggle="modal" data-target="#boostsChartModal">Boost/Hinder Chart</div>
        </li>
      </ul>
    </div>
    <div class="navbar-text">
      <small>Version: {{version}}</small>
    </div>
    <div id="overcomeChartModal" 
         class="modal" 
         tabindex="-1" 
         role="dialog">
      <div class="modal-dialog modal-lg" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Overcome Chart</h5>
            <button type="button" 
                    class="close" 
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img src="images/overcome.jpeg" class="img-fluid" data-dismiss="modal">
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" 
                    type="button" 
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="boostsChartModal" 
         class="modal" 
         tabindex="-1" 
         role="dialog">
      <div class="modal-dialog modal-lg" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Boost/Hinder Chart</h5>
            <button type="button" 
                    class="close" 
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img src="images/boosts.jpeg" class="img-fluid" data-dismiss="modal">
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" 
                    type="button" 
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
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