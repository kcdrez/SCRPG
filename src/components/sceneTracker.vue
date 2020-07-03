<template>
  <div class="scene-tracker">
    <div class="row scene-tracker-header">
      <div class="col">
        <h3><a href="#sceneTrackerData" data-toggle="collapse">Scene Tracker</a></h3>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-sm btn-success border-dark" 
            data-toggle="modal" data-target="#sceneTrackerModal">Create</button>
          <button class="btn btn-sm btn-warning border-dark" @click="clearScene">Clear</button>
        </div>
      </div>
    </div>
    <div id="sceneTrackerData" class="collapse show row">
      <div class="col" v-if="noScenes">
        There is no Scene Tracker.
      </div>
      <div class="col" v-else>
        <div v-for="item in scene.green" class="d-inline" @click="progressScene(item)">
          <img src="images/green_checked.png" v-if="item.checked">
          <img src="images/green.png" v-else>
        </div>
        <div v-for="item in scene.yellow" class="d-inline" @click="progressScene(item)">
          <img src="images/yellow_checked.png" v-if="item.checked">
          <img src="images/yellow.png" v-else>
        </div>
        <div v-for="item in scene.red" class="d-inline" @click="progressScene(item)">
          <img src="images/red_checked.png" v-if="item.checked">
          <img src="images/red.png" v-else>
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
  import Baddie from '../scripts/baddie';

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
        }
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
      }
    },
    computed: {
      noScenes() {
        return this.scene.green.length === 0 &&
          this.scene.yellow.length === 0 &&
          this.scene.red.length === 0;
      }
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
  }
</style>