<template>
  <div class="scene-tracker">
    <div class="row scene-tracker-header">
      <div class="col">
        <h3><a href="#sceneTrackerData" data-toggle="collapse">Environment</a></h3>
      </div>
    </div>
    <div id="sceneTrackerData" class="collapse show">
      <div class="row">
        <div class="col-7">
          <h4>Scene Tracker</h4>
          <div class="btn-group btn-group-sm w-50">
            <button class="btn btn-sm btn-success border-dark" 
              data-toggle="modal" data-target="#sceneTrackerModal">Create</button>
            <button class="btn btn-sm btn-warning border-dark" @click="clearScene">Clear</button>
          </div>
          <div class="" v-if="noScenes">
            There is no Scene Tracker.
          </div>
          <div class="" v-else>
            <div v-for="(item, index) in scene.green" class="d-inline" @click="progressScene(item)" :key="index">
              <img src="images/green_checked.png" v-if="item.checked">
              <img src="images/green.png" v-else>
            </div>
            <div v-for="(item, index) in scene.yellow" class="d-inline" @click="progressScene(item)"  :key="index">
              <img src="images/yellow_checked.png" v-if="item.checked">
              <img src="images/yellow.png" v-else>
            </div>
            <div v-for="(item, index) in scene.red" class="d-inline" @click="progressScene(item)"  :key="index">
              <img src="images/red_checked.png" v-if="item.checked">
              <img src="images/red.png" v-else>
            </div>
          </div>
        </div>
        <div class="col-5">
          <h4>Round Tracker</h4>
          <div class="btn-group btn-group-sm w-75">
            <button class="btn btn-success border-dark" @click="addPlayer">Add Player</button>
            <button class="btn btn-warning border-dark" @click="resetRound">Reset</button>
          </div>
          <ul class="h3">
            <li v-for="item in roundData" 
              @click="item.acted = !item.acted" :key="item.name">
              <i class="fa fa-check text-success" v-if="item.acted"></i>
              <span class="mx-2">{{item.name}}</span>
            </li>
          </ul>
        </div>        
      </div>
    </div>
    <div id="sceneTrackerModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Scene Tracker</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Green</div>
              </div>
              <input class="form-control" v-model.number="green" type="number">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Yellow</div>
              </div>
              <input class="form-control" v-model.number="yellow" type="number">
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">Red</div>
              </div>
              <input class="form-control" v-model.number="red" type="number">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="createScene">Create</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>      
    </div>    
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import Baddie from '../scripts/baddie.js';
  import {unvue} from '../scripts/utilities.js';
  import {mapState} from 'vuex';
  import {diff} from 'deep-diff';

  export default {
    name: 'SceneTracker',
    data() {
      return {
        green: 1,
        yellow: 0,
        red: 0,
        scene: {
          green: [],
          yellow: [],
          red: []
        },
        players: [],
      }
    },
    methods: {
      createScene() {
        this.clearScene();

        for (let i = 0; i < this.green; i++) {
          this.scene.green.push({checked: false});
        }
        for (let i = 0; i < this.yellow; i++) {
          this.scene.yellow.push({checked: false});
        }
        for (let i = 0; i < this.red; i++) {
          this.scene.red.push({checked: false});
        }
        Cookies.set('sceneTracker', this.scene);
      },
      progressScene(item) {
        item.checked = !item.checked;
        Cookies.set('sceneTracker', this.scene);
      },
      clearScene() {
        this.scene.green = [];
        this.scene.yellow = [];
        this.scene.red = [];
        Cookies.set('sceneTracker', this.scene);
      },
      addPlayer() {
        this.$dialog.prompt({
          title: 'Add a Player',
          body: 'Add a player to add to the scene'
        })
        .then(r => {
          this.players.push({name: r.data, acted: false});
        });
      },
      resetRound() {
        this.roundData.forEach(item => item.acted = false);
      }
    },
    computed: {
      noScenes() {
        return this.scene.green.length === 0 &&
          this.scene.yellow.length === 0 &&
          this.scene.red.length === 0;
      },
      roundData() {
        return this.players.concat(this.villains, this.lieutenants, this.minions);
      },
      ...mapState([
        'minions',
        'lieutenants',
        'villains'
      ])
    },
    created() {
      const sceneData = Cookies.getJSON('sceneTracker');
      if (sceneData) {
        this.scene.green = sceneData.green;
        this.scene.yellow = sceneData.yellow;
        this.scene.red = sceneData.red;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .scene-tracker {
    img {
      cursor: pointer;

      &:hover {
        transform: translate(0px, -3px);
      }
    }

    ul {
      padding: 0;

      li {
        cursor: pointer;
        list-style-type: none;
        padding: .25rem;

        &:hover {
          background-color: lightgray;
          border-radius: 5px;
        }
        
        &.acted {
        }
      }
    }
  }
</style>