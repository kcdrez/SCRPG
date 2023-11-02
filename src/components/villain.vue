<template>
  <div class="villain-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h2 class="section-header">
          Villans
          <!-- <a href="#villain-Data" data-toggle="collapse">Villains</a> -->
        </h2>
        <div class="btn-group btn-group-sm my-auto">
          <button
            class="btn btn-sm btn-success border-dark"
            @click="showCreateModal = true"
          >
            Create
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
                  @click="modifyVillain(villain, 'boost')"
                  title="Add a Bonus to this Villain"
                >
                  <img src="images/boost.png" />
                </button>
                <button
                  class="btn btn-warning border-dark"
                  @click="modifyVillain(villain, 'hinder')"
                  title="Add a Penalty to this Villain"
                >
                  <img src="images/hinder.png" />
                </button>
                <button
                  class="btn btn-secondary border-dark"
                  @click="modifyVillain(villain, 'defend')"
                  title="Add a Defend to this Villain"
                >
                  <img src="images/defend.png" />
                </button>
                <button
                  class="btn btn-primary border-dark"
                  @click="$emit('add-minion', villain.id)"
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
    <Modal :isOpen="showCreateModal">
      <template v-slot:header>Create a Villain</template>
      <template v-slot:body>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-text border-dark">Name</div>
          <input
            class="form-control border-dark"
            v-model.trim="name"
            type="text"
            ref="villainName"
            @keydown.enter="createVillain()"
          />
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-primary border-dark"
          type="button"
          @click="createVillain()"
        >
          Create
        </button>
        <button class="btn btn-secondary border-dark" type="button">
          Close
        </button>
      </template>
    </Modal>
    <Modal :isOpen="showModifierModal">
      <template v-slot:header>Add a {{ modifier.type }}</template>
      <template v-slot:body>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-text border-dark">Name</div>
          <input
            class="form-control border-dark"
            type="text"
            v-model.trim="modifier.name"
            @keydown.enter="target.addModifier(modifier)"
            ref="modifierName"
          />
        </div>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-text border-dark">Amount</div>
          <input
            class="form-control border-dark"
            v-model.number="modifier.amount"
            type="number"
            :max="modifier.max"
            :min="modifier.min"
            @keydown.enter="target.addModifier(modifier)"
          />
        </div>
        <div class="d-inline" v-if="modifier.type !== 'Defend'">
          <label for="mod-villain-persistent" class="c-pointer"
            >Persistent?</label
          >
          <input
            type="checkbox"
            v-model="modifier.persistent"
            id="mod-villain-persistent"
          />
        </div>
        <div class="d-inline mx-3" v-if="modifier.type !== 'Defend'">
          <label for="mod-villain-exclusive" class="c-pointer"
            >Exclusive?</label
          >
          <input
            type="checkbox"
            v-model="modifier.exclusive"
            id="mod-villain-exclusive"
          />
        </div>
      </template>
      <template v-slot:footer>
        <button
          type="button"
          class="btn btn-primary border-dark"
          @click="target.addModifier(modifier)"
        >
          Add
        </button>
        <button
          type="button"
          class="btn btn-secondary border-dark"
          @click="showModifierModal = false"
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

import Modifier from "./modifier.vue";
import Modal from "components/general/modal.vue";

export default defineComponent({
  name: "Villains",
  components: {
    Modifier,
    Modal,
  },
  data() {
    return {
      name: "",
      target: null,
      modifier: {
        type: "",
        amount: 0,
        max: 0,
        min: 0,
        persistent: false,
        exclusive: false,
      },
      showCreateModal: false,
      showModifierModal: false,
    };
  },
  computed: {
    ...mapState(["villains"]),
  },
  methods: {
    createVillain() {
      if (this.name !== "") {
        this.$store.dispatch("upsertBaddie", {
          name: this.name,
          type: "villains",
        });
        this.showCreateModal = false;
      }
    },
    modifyVillain(villain, type) {
      if (type === "defend") {
        this.modifier.type = "Defend";
        this.modifier.max = 100;
        this.modifier.min = 1;
        this.modifier.amount = 1;
      } else if (type === "boost") {
        this.modifier.max = 4;
        this.modifier.min = 1;
        this.modifier.amount = 1;
        this.modifier.type = "Bonus";
      } else if (type === "hinder") {
        this.modifier.max = -1;
        this.modifier.min = -4;
        this.modifier.amount = -1;
        this.modifier.type = "Penalty";
      } else {
        return;
      }
      this.target = villain;
      this.showModifierModal = true;
    },
    editVillain(villain, index) {
      villain.beginEdit();
      this.$refs.editName[index].focus();
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
