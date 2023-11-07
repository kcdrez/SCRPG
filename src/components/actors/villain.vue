<template>
  <div class="villain-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h2 class="section-header">Villans</h2>
        <div class="btn-group btn-group-sm my-auto">
          <button
            class="btn btn-sm btn-success border-dark"
            @click="$dialog.createActor({ type: 'Villain' })"
          >
            Add
          </button>
          <button
            class="btn btn-warning border-dark"
            title="Remove all players from the scene"
            @click="clearVillains()"
            :disabled="villains.length === 0"
          >
            Clear
          </button>
          <button
            class="btn btn-primary border-dark"
            @click="$refs.import.click()"
            title="Import Villain data from an xlsx file"
          >
            Import
          </button>
          <button
            class="btn btn-secondary border-dark"
            @click="
              $store.dispatch('export', {
                type: 'villains',
                fileName: 'villains',
              })
            "
            title="Export all Villains to an xlsx file"
            :disabled="villains.length === 0"
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
              filters: ['villains', 'minions', 'bonus', 'penalty', 'defend'],
            })
          "
        />
      </div>
    </div>
    <div id="villain-Data" class="collapse show row">
      <div class="col mb-2" v-if="villains.length === 0">
        There are no Villains.
      </div>
      <div
        class="col-6 mb-3"
        v-for="(villain, index) in villains"
        :key="villain.id"
        :id="villain.id"
      >
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <input
              type="text"
              v-model.trim="villain.tempName"
              class="form-control form-control-sm d-inline w-50 border-dark"
              @keypress.enter="villain.saveEdit()"
              @keydown.esc="villain.cancelEdit()"
              v-if="villain.editing"
              ref="editName"
            />
            <h3 class="villain-name" v-else>{{ villain.name }}</h3>
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-secondary border-dark"
                title="Edit this Villain"
                @click="editVillain(villain, index)"
                v-if="!villain.editing"
              >
                Edit
              </button>
              <button
                class="btn btn-success border-dark"
                title="Save edits on this Villain"
                @click="villain.saveEdit()"
                v-if="villain.editing"
              >
                Save
              </button>
              <button
                class="btn btn-warning border-dark"
                title="Cancel edits on this Villain"
                @click="villain.cancelEdit()"
                v-if="villain.editing"
              >
                Cancel
              </button>
              <button
                class="btn btn-danger border-dark"
                @click="villain.remove()"
                title="Delete this Villain"
              >
                Remove
              </button>
              <button
                class="btn btn-secondary border-dark"
                title="Export this Villain to an xlsx file"
                @click="
                  $store.dispatch('export', {
                    type: 'villains',
                    fileName: 'villains',
                    id: villain.id,
                  })
                "
              >
                Export
              </button>
            </div>
          </div>
          <div :id="`villain-${villain.id}`" class="card-body collapse show">
            <div class="text-center">
              <div class="btn-group btn-group-sm w-50">
                <button
                  class="btn btn-success border-dark"
                  @click="
                    $dialog.modifyActor({ type: 'Bonus', target: villain })
                  "
                  title="Add a Bonus to this Villain"
                >
                  <img src="images/boost.png" />
                </button>
                <button
                  class="btn btn-warning border-dark"
                  @click="
                    $dialog.modifyActor({ type: 'Penalty', target: player })
                  "
                  title="Add a Penalty to this Villain"
                >
                  <img src="images/hinder.png" />
                </button>
                <button
                  class="btn btn-secondary border-dark"
                  @click="
                    $dialog.modifyActor({ type: 'Defend', target: player })
                  "
                  title="Add a Defend to this Villain"
                >
                  <img src="images/defend.png" />
                </button>
                <button
                  class="btn btn-primary border-dark"
                  @click="
                    $dialog.createActor({
                      type: 'Minion',
                      ownerId: villain.id,
                    })
                  "
                  title="Add a Minion to this Villain"
                >
                  <span class="fa-stack">
                    <i class="fas fa-dragon" transform="right-4 down-4"></i>
                    <i
                      class="fas fa-plus"
                      transform="shrink-6 left-4 down-4"
                    ></i>
                  </span>
                </button>
              </div>
            </div>
            <Modifier
              label="bonus"
              labelPlural="bonuses"
              :list="villain.bonuses"
              :editing="villain.editing"
              @remove="villain.removeModifier('bonuses', $event)"
              @cancel-edit="villain.cancelEdit()"
            ></Modifier>
            <Modifier
              label="penalty"
              labelPlural="penalties"
              :list="villain.penalties"
              :editing="villain.editing"
              @remove="villain.removeModifier('penalties', $event)"
              @cancel-edit="villain.cancelEdit()"
            ></Modifier>
            <Modifier
              label="defend"
              labelPlural="defends"
              :list="villain.defends"
              :editing="villain.editing"
              @remove="villain.removeModifier('defends', $event)"
              @cancel-edit="villain.cancelEdit()"
            ></Modifier>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

import Modifier from "./modifier.vue";

export default defineComponent({
  name: "Villains",
  components: {
    Modifier,
  },
  data() {
    return {
      modifierData: {
        target: null,
        type: "Bonus",
      },
      createData: {
        type: "Villain",
        ownerId: null,
      },
    };
  },
  computed: {
    ...mapState(["villains"]),
  },
  methods: {
    ...mapActions(["resetBaddies"]),
    editVillain(villain, index) {
      villain.beginEdit();
      this.$refs.editName[index].focus();
    },
    clearVillains() {
      this.$dialog.confirm({
        body: `Are you sure you want to clear all ${this.label} from the scene?`,
        onConfirmDialog: () => {
          this.resetBaddies({ type: "villains" });
        },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.villain-name {
  text-transform: capitalize;
  display: inline;
}
</style>
