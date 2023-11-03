<template>
  <div>
    <div class="card">
      <div class="card-header text-center">
        <h3>Scene Tracker</h3>
        <div class="btn-group btn-group-sm w-50">
          <button
            class="btn btn-sm btn-success border-dark"
            title="Create a new Scene Tracker"
            @click="showCreateModal = true"
          >
            Create
          </button>
          <button
            class="btn btn-sm btn-warning border-dark"
            @click="scene.clear()"
            title="Clear the Scene Tracker"
          >
            Clear
          </button>
          <button
            class="btn btn-primary border-dark"
            @click="$refs.import.click()"
            title="Import Scene Tracker data from an xlsx file"
          >
            Import
          </button>
          <button
            class="btn btn-secondary border-dark"
            @click="
              $store.dispatch('export', { type: 'scene', fileName: scene.name })
            "
            title="Export Scene Tracker data to an xlsx file"
            :disabled="scene.isEmpty"
          >
            Export
          </button>
        </div>
        <input
          type="file"
          accept=".xlsx"
          class="d-none"
          ref="import"
          @change="
            $store.dispatch('import', {
              files: $event.target.files,
              filters: ['scene'],
            })
          "
        />
      </div>
      <div class="card-body text-center">
        <div v-if="scene.isEmpty">There is no Scene Tracker.</div>
        <div v-else>
          <h4 class="scene-name text-capitalize">{{ scene.name }}</h4>
          <div
            v-for="(item, index) in scene.green"
            class="d-inline"
            @click="scene.progressScene(item)"
            :key="'green' + index"
          >
            <img src="images/green_checked.png" v-if="item.checked" />
            <img src="images/green.png" v-else />
          </div>
          <div
            v-for="(item, index) in scene.yellow"
            class="d-inline"
            @click="scene.progressScene(item)"
            :key="'yellow' + index"
          >
            <img src="images/yellow_checked.png" v-if="item.checked" />
            <img src="images/yellow.png" v-else />
          </div>
          <div
            v-for="(item, index) in scene.red"
            class="d-inline"
            @click="scene.progressScene(item)"
            :key="'red' + index"
          >
            <img src="images/red_checked.png" v-if="item.checked" />
            <img src="images/red.png" v-else />
          </div>
        </div>
      </div>
    </div>
    <Modal :isOpen="showCreateModal">
      <template v-slot:header
        ><h5 class="modal-title">Edit Scene Tracker</h5></template
      >
      <template v-slot:body>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-text border-dark">Name</div>
          <input
            class="form-control border-dark"
            v-model.trim="name"
            type="text"
            ref="scene"
            @keypress.enter="createScene"
          />
        </div>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-text border-dark">Green</div>
          <input
            class="form-control border-dark"
            v-model.number="green"
            type="number"
            ref="green"
            min="0"
            @keypress.enter="createScene"
          />
        </div>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-text border-dark">Yellow</div>
          <input
            class="form-control border-dark"
            v-model.number="yellow"
            type="number"
            ref="yellow"
            min="0"
            @keypress.enter="createScene"
          />
        </div>
        <div class="input-group input-group-sm">
          <div class="input-group-text border-dark">Red</div>
          <input
            class="form-control border-dark"
            v-model.number="red"
            type="number"
            ref="red"
            min="0"
            @keypress.enter="createScene"
          />
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-success border-dark"
          type="button"
          @click="createScene"
          :disabled="name === ''"
          :title="!name ? 'Enter a name to create the Scene Tracker' : ''"
        >
          Create
        </button>
        <button
          class="btn btn-secondary border-dark"
          type="button"
          @click="showCreateModal = false"
        >
          Close
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";

import Modal from "components/modals/modal.vue";

export default defineComponent({
  name: "SceneTracker",
  components: { Modal },
  data() {
    return {
      green: 2,
      yellow: 4,
      red: 2,
      name: "",
      showCreateModal: false,
    };
  },
  computed: {
    ...mapState(["scene"]),
  },
  methods: {
    createScene() {
      if (this.name !== "") {
        this.scene.create(this.green, this.yellow, this.red, this.name);
        this.showCreateModal = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/mixins";

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
