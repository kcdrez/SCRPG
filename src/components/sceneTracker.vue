<template>
  <div>
    <div class="card">
      <div class="card-header text-center">
        <h3>Scene Tracker</h3>
        <div class="btn-group btn-group-sm w-50">
          <button class="btn btn-sm btn-success border-dark" 
                  data-toggle="modal" 
                  data-target="#sceneTrackerModal" 
                  title="Create a new Scene Tracker">Create</button>
          <button class="btn btn-sm btn-warning border-dark" 
                  @click="scene.clear()" 
                  title="Clear the Scene Tracker">Clear</button>
          <button class="btn btn-primary border-dark"
                  @click="$refs.import.click()"
                  title="Import Scene Tracker data from an xlsx file">Import</button>
          <button class="btn btn-secondary border-dark"
                  @click="$store.dispatch('export', { type: 'scene', fileName: scene.name })"
                  title="Export Scene Tracker data to an xlsx file"
                  :disabled="scene.isEmpty">Export</button>
        </div>
        <input type="file"
               accept=".xlsx"
               class="d-none"
               ref="import"
              @change="$store.dispatch('import', { files: $event.target.files, filters: ['scene'] })">
      </div>
      <div class="card-body text-center">
        <div v-if="scene.isEmpty">
          There is no Scene Tracker.
        </div>
        <div v-else>
          <h4 class="scene-name text-capitalize">{{ scene.name }}</h4>
          <div v-for="(item, index) in scene.green" 
                class="d-inline" 
                @click="scene.progressScene(item)" 
                :key="'green' + index">
            <img src="images/green_checked.png" 
                  v-if="item.checked">
            <img src="images/green.png" 
                  v-else>
          </div>
          <div v-for="(item, index) in scene.yellow" 
                class="d-inline" 
                @click="scene.progressScene(item)"
                :key="'yellow' + index">
            <img src="images/yellow_checked.png" 
                  v-if="item.checked">
            <img src="images/yellow.png" 
                  v-else>
          </div>
          <div v-for="(item, index) in scene.red" 
                class="d-inline" 
                @click="scene.progressScene(item)"
                :key="'red' + index">
            <img src="images/red_checked.png" 
                  v-if="item.checked">
            <img src="images/red.png" 
                  v-else>
          </div>
        </div>
      </div>
    </div>
    <div id="sceneTrackerModal"
         class="modal"
         tabindex="-1"
         role="dialog">
      <div class="modal-dialog"
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Scene Tracker</h5>
            <button type="button"
                    class="close"
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Name</div>
              </div>
              <input class="form-control"
                     v-model.trim="name"
                     type="text"
                     ref="scene"
                     @keypress.enter="createScene">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Green</div>
              </div>
              <input class="form-control"
                     v-model.number="green"
                     type="number"
                     ref="green"
                     min="0"
                     @keypress.enter="createScene">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Yellow</div>
              </div>
              <input class="form-control"
                     v-model.number="yellow"
                     type="number"
                     ref="yellow"
                     min="0"
                     @keypress.enter="createScene">
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">Red</div>
              </div>
              <input class="form-control"
                     v-model.number="red" 
                     type="number"
                     ref="red"
                     min="0"
                     @keypress.enter="createScene">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success border-dark"
                    type="button"
                    data-dismiss="modal"
                    @click="createScene"
                    :disabled="name === ''"
                    :title="!name ? 'Enter a name to create the Scene Tracker' : ''">Create</button>
            <button class="btn btn-secondary border-dark"
                    type="button"
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    data() {
      return {
        green: 2,
        yellow: 4,
        red: 2,
        name: '',
      }
    },
    computed: {
      ...mapState([
        'scene'
      ])
    },
    methods: {
      createScene() {
        if (this.name !== '') {
          this.scene.create(this.green, this.yellow, this.red, this.name);
          $('#sceneTrackerModal').modal('hide');
        }
      }    
    },
    mounted() {
      $('#sceneTrackerModal').on('shown.bs.modal', e => {
        this.$refs.scene.focus();
      });
    }
  }
</script>

<style lang="scss" scoped>
  @import '../styles/mixins';
  
  img {
    cursor: pointer;
    max-width: 90px;

    &:hover {
      transform: translate(0px, -3px);
    }
  }

  .scene-name {
    @include shadow-light();
  }
</style>