<template>
  <div class="baddie-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h2 class="section-header">
          <a :href="`#${label}-Data`" data-toggle="collapse">{{ label }}</a>
        </h2>
        <div class="btn-group btn-group-sm my-auto">
          <button
            class="btn btn-sm btn-success border-dark"
            @click="modal('show')"
          >
            Create
          </button>
          <button
            class="btn btn-primary border-dark"
            @click="$refs.import.click()"
            :title="`Import ${labelSingle} data from an xlsx file`"
          >
            Import
          </button>
          <button
            class="btn btn-secondary border-dark"
            @click="
              $store.dispatch('export', {
                type: label.toLowerCase(),
                fileName: label,
              })
            "
            :title="`Export all ${label} to an xlsx file`"
            :disabled="list.length === 0"
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
              filters: [label.toLowerCase(), 'bonus', 'penalty', 'defend'],
            })
          "
        />
      </div>
    </div>
    <div :id="`${label}-Data`" class="collapse show row">
      <div class="col mb-2" v-if="list.length === 0">
        There are no {{ label }}.
      </div>
      <table
        class="table table-sm table-striped table-bordered table-dark col"
        v-else
      >
        <thead class="text-center">
          <tr>
            <th width="15%">Name (Owner)</th>
            <th width="10%">Die Size</th>
            <th width="10%">Count</th>
            <th width="25%">Modifiers</th>
            <th width="30%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="baddie in list" :key="baddie.id">
            <tr :id="baddie.id">
              <!-- Name (Owner) -->
              <td class="text-center align-middle text-capitalize">
                <template v-if="baddie.editing">
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                      <div class="input-group-text border-dark">Name</div>
                    </div>
                    <input
                      class="form-control border-dark"
                      v-model.trim="baddie.tempName"
                      type="text"
                      @keypress.enter="baddie.saveEdit()"
                      @keydown.esc="baddie.cancelEdit()"
                      ref="nameEdit"
                    />
                  </div>
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                      <div class="input-group-text border-dark">Owner</div>
                    </div>
                    <select
                      class="form-control border-dark"
                      @keypress.enter="baddie.saveEdit()"
                      @keydown.esc="baddie.cancelEdit()"
                      v-model="baddie.tempOwner"
                    >
                      <option :value="null">-</option>
                      <option
                        v-for="player in players"
                        :key="player.id"
                        :value="player.id"
                      >
                        {{ player.name }}
                      </option>
                      <option
                        v-for="villain in villains"
                        :key="villain.id"
                        :value="villain.id"
                      >
                        {{ villain.name }}
                      </option>
                      <option v-if="scene.name" :value="scene.id">
                        {{ scene.name }}
                      </option>
                    </select>
                  </div>
                </template>
                <template v-else>
                  <div>{{ baddie.name }}</div>
                  <div v-if="baddie.owner">({{ baddie.owner.name }})</div>
                </template>
              </td>
              <!-- Die Size -->
              <td class="text-center align-middle">
                <input
                  type="number"
                  class="form-control form-control-sm border-dark"
                  v-model="baddie.tempSize"
                  v-if="baddie.editing"
                  min="4"
                  max="12"
                  step="2"
                  @keypress.enter="baddie.saveEdit()"
                  @keydown.esc="baddie.cancelEdit()"
                />
                <img
                  :src="`images/d${baddie.size}.png`"
                  :title="`This minion uses a d${baddie.size}`"
                  v-else
                />
              </td>
              <!-- Count -->
              <td class="text-center align-middle">
                <input
                  type="number"
                  class="form-control form-control-sm border-dark"
                  v-model="baddie.tempCount"
                  v-if="baddie.editing"
                  min="1"
                  @keypress.enter="baddie.saveEdit()"
                  @keydown.esc="baddie.cancelEdit()"
                />
                <template v-else>{{ baddie.count }}</template>
              </td>
              <!-- Modifiers -->
              <td>
                <Modifier
                  label="bonus"
                  labelPlural="bonuses"
                  :list="baddie.bonuses"
                  :editing="baddie.editing"
                  @remove="baddie.removeModifier('bonuses', $event)"
                  @save-edit="baddie.saveEdit()"
                  @cancel-edit="baddie.cancelEdit()"
                ></Modifier>
                <Modifier
                  label="penalty"
                  labelPlural="penalties"
                  :list="baddie.penalties"
                  :editing="baddie.editing"
                  @remove="baddie.removeModifier('penalties', $event)"
                  @save-edit="baddie.saveEdit()"
                  @cancel-edit="baddie.cancelEdit()"
                ></Modifier>
                <Modifier
                  label="defend"
                  labelPlural="defends"
                  :list="baddie.defends"
                  :editing="baddie.editing"
                  @remove="baddie.removeModifier('defends', $event)"
                  @save-edit="baddie.saveEdit()"
                  @cancel-edit="baddie.cancelEdit()"
                ></Modifier>
              </td>
              <!-- Actions -->
              <td class="align-middle">
                <div
                  class="btn-group btn-group-sm w-100 mb-2 actions"
                  role="group"
                >
                  <button
                    class="btn btn-success border-dark"
                    :title="`Add a Bonus to this ${baddie.typeLabel}`"
                    @click="modifyBaddie('boost', baddie.id)"
                  >
                    <img src="images/boost.png" />
                  </button>
                  <button
                    class="btn btn-warning border-dark"
                    :title="`Add a Penalty to this ${baddie.typeLabel}`"
                    @click="modifyBaddie('hinder', baddie.id)"
                  >
                    <img src="images/hinder.png" />
                  </button>
                  <button
                    class="btn btn-success border-dark"
                    :title="`Add a Defend to this ${baddie.typeLabel}`"
                    @click="modifyBaddie('defend', baddie.id)"
                  >
                    <img src="images/defend.png" />
                  </button>
                </div>
                <div class="btn-group btn-group-sm w-100 actions">
                  <button
                    class="btn btn-warning border-dark text-dark"
                    :title="`Demote this ${baddie.typeLabel} one die size (min 4)`"
                    @click="baddie.demote()"
                    :disabled="baddie.size <= 4"
                  >
                    <icon :icon="['fas', 'level-down-alt']" />
                  </button>
                  <button
                    class="btn btn-success border-dark text-dark"
                    :title="`Promote this ${baddie.typeLabel} one die size (max 12)`"
                    @click="baddie.promote()"
                    :disabled="baddie.size >= 12"
                  >
                    <icon :icon="['fas', 'level-up-alt']" />
                  </button>
                  <button
                    class="btn btn-info border-dark text-dark"
                    :title="`Add another ${baddie.typeLabel} to this row`"
                    @click="baddie.count++"
                  >
                    <icon :icon="['far', 'plus-square']" />
                  </button>
                  <button
                    class="btn btn-danger border-dark text-dark"
                    :title="`Remove one ${baddie.typeLabel} from this group from the scene`"
                    @click="baddie.count--"
                  >
                    <icon :icon="['far', 'trash-alt']" />
                  </button>
                  <button
                    class="btn btn-secondary border-dark text-dark"
                    :title="`Edit this ${baddie.typeLabel}`"
                    @click="editBaddie(baddie, index)"
                    v-if="baddie.allowEdit && !baddie.editing"
                  >
                    <icon :icon="['far', 'edit']" />
                  </button>
                  <button
                    class="btn btn-success border-dark text-dark"
                    :title="`Save edits on this ${baddie.typeLabel}`"
                    @click="baddie.saveEdit()"
                    v-if="baddie.editing"
                  >
                    <icon :icon="['far', 'save']" />
                  </button>
                  <button
                    class="btn btn-warning border-dark text-dark"
                    @click="baddie.cancelEdit()"
                    v-if="baddie.editing"
                    :title="`Cancel edits on this ${baddie.typeLabel}`"
                  >
                    <icon :icon="['fas', 'ban']" />
                  </button>
                  <button
                    class="btn btn-secondary border-dark text-dark"
                    @click="
                      $store.dispatch('export', {
                        type: label.toLowerCase(),
                        fileName: label,
                        id: baddie.id,
                      })
                    "
                    :title="`Export this ${baddie.typeLabel} to an xlsx file`"
                  >
                    <icon :icon="['fas', 'file-download']" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div :id="`createModal-${label}`" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create a {{ labelSingle }}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text border-dark">Name</div>
              </div>
              <input
                class="form-control border-dark"
                v-model.trim="baddieData.name"
                type="text"
                @keydown.enter="createBaddie()"
                ref="createName"
              />
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text border-dark">Size</div>
              </div>
              <input
                class="form-control border-dark"
                v-model.number="baddieData.size"
                type="number"
                step="2"
                min="4"
                max="12"
                @keydown.enter="createBaddie()"
              />
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text border-dark">Count</div>
              </div>
              <input
                class="form-control border-dark"
                v-model.number="baddieData.count"
                type="number"
                min="1"
                @keydown.enter="createBaddie()"
              />
            </div>
            <div class="input-group input-group-sm mb-3" v-if="allowOwner">
              <div class="input-group-prepend">
                <div class="input-group-text border-dark">Owner</div>
              </div>
              <select
                class="form-control border-dark"
                @keydown.enter="createBaddie()"
                v-model="baddieData.owner"
              >
                <option :value="null">-</option>
                <option
                  v-for="player in players"
                  :key="player.id"
                  :value="player.id"
                >
                  {{ player.name }}
                </option>
                <option
                  v-for="villain in villains"
                  :key="villain.id"
                  :value="villain.id"
                >
                  {{ villain.name }}
                </option>
                <option v-if="scene.name" :value="scene.id">
                  {{ scene.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-primary border-dark"
              type="button"
              @click="createBaddie()"
            >
              Create
            </button>
            <button
              class="btn btn-secondary border-dark"
              type="button"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      :id="`modifierModal-${label}`"
      class="modal"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a {{ baddieData.modifier.type }}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text border-dark">Name</div>
              </div>
              <input
                class="form-control border-dark"
                type="text"
                v-model.trim="baddieData.modifier.name"
                @keydown.enter="addModifier"
                ref="modName"
              />
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text border-dark">Amount</div>
              </div>
              <input
                class="form-control border-dark"
                v-model.number="baddieData.modifier.amount"
                type="number"
                :max="baddieData.modifier.max"
                :min="baddieData.modifier.min"
                @keydown.enter="addModifier"
              />
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text border-dark">Apply To</div>
              </div>
              <select
                class="form-control border-dark"
                v-model.number="baddieData.modifier.applyTo"
                @keydown.enter="addModifier"
              >
                <option value="single">Just one</option>
                <option value="row">
                  All of the {{ label.toLowerCase() }} in this row
                </option>
                <option value="name">
                  All of the {{ label.toLowerCase() }} with the same name
                </option>
              </select>
            </div>
            <div class="d-inline" v-if="baddieData.modifier.type !== 'Defend'">
              <label :for="`persistent-${labelSingle}`" class="c-pointer"
                >Persistent?</label
              >
              <input
                type="checkbox"
                v-model="baddieData.modifier.persistent"
                @keydown.enter="addModifier"
                :id="`persistent-${labelSingle}`"
              />
            </div>
            <div
              class="d-inline mx-3"
              v-if="baddieData.modifier.type !== 'Defend'"
            >
              <label :for="`exclusive-${labelSingle}`" class="c-pointer"
                >Exclusive?</label
              >
              <input
                type="checkbox"
                v-model="baddieData.modifier.exclusive"
                @keydown.enter="addModifier"
                :id="`exclusive-${labelSingle}`"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary border-dark"
              @click="addModifier"
              :disabled="baddieData.modifier.name === ''"
            >
              Add
            </button>
            <button
              type="button"
              class="btn btn-secondary border-dark"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Cookies from "js-cookie";
import { Baddie } from "../scripts/baddie";
import { mapState } from "vuex";
import Modifier from "./modifier.vue";
import { unvue } from "../scripts/utilities";
import { sortActors } from "../scripts/actor";

export default defineComponent({
  name: "BaddieList",
  components: {
    Modifier,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    allowOwner: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      baddieData: {
        name: "",
        size: 8,
        count: 1,
        owner: null,
        modifier: {
          amount: 0,
          name: "",
          max: 0,
          min: 0,
          type: "",
          target: {
            id: null,
            instanceId: null,
          },
          persistent: false,
          exclusive: false,
          applyTo: "single",
        },
      },
    };
  },
  computed: {
    list() {
      return this.$store.state[this.label.toLowerCase()].sort(sortActors);
    },
    ...mapState(["players", "villains", "scene"]),
    labelSingle() {
      switch (this.label) {
        case "Minions":
        default:
          return "Minion";
        case "Lieutenants":
          return "Lieutenant";
      }
    },
  },
  methods: {
    createBaddie(baddie) {
      this.$store.dispatch(
        "upsertBaddie",
        Object.assign({ type: this.label.toLowerCase() }, this.baddieData)
      );
      $(`#createModal-${this.label}`).modal("hide");
      $(":focus").blur();
    },
    addBaddie(name) {
      this.baddieData.name = name;
      $(`#createModal-${this.label}`).modal("show");
    },
    modifyBaddie(type, id, instanceId) {
      if (type === "boost") {
        this.baddieData.modifier.max = 4;
        this.baddieData.modifier.min = 1;
        this.baddieData.modifier.amount = 1;
        this.baddieData.modifier.type = "Bonus";
      } else if (type === "hinder") {
        this.baddieData.modifier.max = -1;
        this.baddieData.modifier.min = -4;
        this.baddieData.modifier.amount = -1;
        this.baddieData.modifier.type = "Penalty";
      } else if (type === "defend") {
        this.baddieData.modifier.max = 100;
        this.baddieData.modifier.min = 1;
        this.baddieData.modifier.amount = 1;
        this.baddieData.modifier.type = "Defend";
        this.baddieData.modifier.persistent = false;
        this.baddieData.modifier.exclusive = false;
      } else {
        return;
      }
      this.baddieData.modifier.target.id = id;
      this.baddieData.modifier.target.instanceId = instanceId;
      $(`#modifierModal-${this.label}`).modal("show");

      this.$nextTick(() => {
        this.$refs.modName.focus();
      });
    },
    addModifier() {
      if (this.baddieData.modifier.name !== "") {
        this.$store.dispatch("modifyBaddie", {
          type: this.label.toLowerCase(),
          modifier: this.baddieData.modifier,
        });
        $(`#modifierModal-${this.label}`).modal("hide");
        // this.baddieData.modifier.target.instanceId = null;
      }
    },
    modal(status, owner) {
      $(`#createModal-${this.label}`).modal(status);
      this.baddieData.owner = owner || null;
      this.$nextTick(() => {
        this.$refs.createName.focus();
      });
    },
    editBaddie(baddie, index) {
      baddie.beginEdit();
      this.$nextTick(() => {
        this.$refs.nameEdit[index].focus();
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.baddie-list {
  img {
    width: 30px;
  }
  .actions {
    button {
      font-size: 20px;
    }
  }
  thead {
    position: sticky;
    z-index: 4;
    top: 56px; //will need to adjust if navbar ever changes
  }
}
</style>
