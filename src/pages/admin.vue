<template>
  <div class="container">
    <div class="row">
      <h1 class="col text-center">
        GM Management
      </h1>
    </div>
    <div class="row">
      <div class="col-4">
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
      <div class="col">
        <button class="btn btn-primary" @click="createScene">Create Scene Tracker</button>
        <button class="btn btn-warning" @click="clearScene">Clear Scene Tracker</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h3>Scene Tracker</h3>
        <div v-for="item in scene.green" class="d-inline" @click="progressScene(item)">
          <img src="/src/assets/images/green_checked.png" v-if="item.checked">
          <img src="/src/assets/images/green.png" v-else>
        </div>
        <div v-for="item in scene.yellow" class="d-inline" @click="progressScene(item)">
          <img src="/src/assets/images/yellow_checked.png" v-if="item.checked">
          <img src="/src/assets/images/yellow.png" v-else>
        </div>
        <div v-for="item in scene.red" class="d-inline" @click="progressScene(item)">
          <img src="/src/assets/images/red_checked.png" v-if="item.checked">
          <img src="/src/assets/images/red.png" v-else>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';

  export default {
    name: 'AdminPage',
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