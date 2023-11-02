<template>
  <div>
    <div class="card">
      <div class="card-header text-center">
        <h3>Round Tracker</h3>
        <button
          class="btn btn-sm btn-danger border-dark mb-2"
          @click="$store.dispatch('resetRound')"
          title="Reset the round, marking all actors as not yet acted"
        >
          Reset Round Tracker
        </button>
        <div class="input-group input-group-sm justify-content-center">
          <div class="input-group-text border-dark">Players:</div>
          <button
            class="btn btn-success border-dark"
            title="Add a new player to the scene"
            @click="showCreateModal = true"
          >
            Add
          </button>
          <button
            class="btn btn-warning border-dark"
            title="Remove all players from the scene"
            @click="clearPlayers"
          >
            Clear
          </button>
          <button
            class="btn btn-primary border-dark"
            @click="$refs.import.click()"
          >
            Import
          </button>
          <button
            class="btn btn-secondary border-dark"
            title="Export the player data to an xlsx file"
            @click="
              $store.dispatch('export', {
                type: 'players',
                fileName: 'players',
              })
            "
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
              filters: ['player', 'minions', 'bonus', 'penalty', 'defend'],
            })
          "
        />
      </div>
      <div class="card-body">
        <table
          class="table table-sm table-bordered table-dark table-striped"
          v-if="actors.length > 0"
        >
          <thead class="text-center">
            <tr>
              <th width="28%">Name (Owner)</th>
              <th width="22%">Type</th>
              <th width="20%">HP/Die Size</th>
              <th width="30%">Actions</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <template v-for="(actor, index) in actors">
              <tr
                v-if="!!actor.name"
                :key="actor.id"
                :id="actor.type === 'player' ? actor.id : ''"
              >
                <!-- Name/Owner -->
                <td class="text-capitalize c-pointer align-middle">
                  <input
                    class="form-control form-control-sm border-dark"
                    v-model="actor.tempName"
                    v-if="actor.editing"
                    @keypress.enter="actor.saveEdit()"
                    @keydown.esc="actor.cancelEdit()"
                    ref="nameEdit"
                  />
                  <div
                    v-else
                    @click="actor.takenAction()"
                    :title="`Click to toggle this ${actor.typeLabel} to have acted already in the current round`"
                  >
                    <span v-if="actor.acted">
                      <i class="fas fa-check text-success"></i>
                    </span>
                    {{ actor.name }}
                    <sup
                      v-if="actor.owner"
                      :title="`This ${actor.typeLabel} belongs to ${actor.owner.name}`"
                      class="c-help"
                      :class="{
                        'text-success': actor.owner.type === 'player',
                        'text-warning': actor.owner.type === 'scene',
                        'text-danger': actor.owner.type === 'villains',
                      }"
                    >
                      <i class="fas fa-user"></i>
                    </sup>
                    <sup
                      class="text-success c-help"
                      v-if="actor.bonuses && actor.bonuses.length"
                      :title="`This ${actor.typeLabel} has ${
                        actor.bonuses.length
                      } Bonus${actor.bonuses.length > 1 ? 'es' : ''}`"
                    >
                      {{ actor.bonuses.length }}
                    </sup>
                    <sup
                      class="text-warning c-help"
                      v-if="actor.penalties && actor.penalties.length"
                      :title="`This ${actor.typeLabel} has ${
                        actor.penalties.length
                      } Penalt${actor.penalties.length > 1 ? 'ies' : 'y'}`"
                    >
                      {{ actor.penalties.length }}
                    </sup>
                    <sup
                      class="text-secondary c-help"
                      v-if="actor.defends && actor.defends.length"
                      :title="`This ${actor.typeLabel} has ${
                        actor.defends.length
                      } Defend${actor.defends.length > 1 ? 's' : ''}`"
                    >
                      {{ actor.defends.length }}
                    </sup>
                  </div>
                </td>
                <!-- Type -->
                <td class="text-capitalize c-pointer align-middle">
                  <div
                    v-if="!actor.editing"
                    @click="actor.takenAction()"
                    :title="`Click to toggle this ${actor.typeLabel} to have acted already in the current round`"
                  >
                    {{ actor.typeLabel }}
                  </div>
                </td>
                <!-- HP/Die Size -->
                <td class="align-middle">
                  <template v-if="typeof actor.hp === 'number'">
                    <input
                      type="number"
                      class="form-control form-control-sm border-dark"
                      v-model.number="actor.tempHP"
                      v-if="actor.editing"
                      min="0"
                      :max="actor.maxHp"
                      @keypress.enter="actor.saveEdit()"
                      @keydown.esc="actor.cancelEdit()"
                    />
                    <template v-else>
                      <span :class="'hp-' + actor.zone">{{ actor.hp }}</span>
                      <span @click="actor.hp++">
                        <i
                          class="fas fa-chevron-circle-up c-pointer change-hp"
                          :title="`Increase ${actor.typeLabel} HP`"
                        ></i>
                      </span>
                      <span @click="actor.hp--">
                        <i
                          class="fas fa-chevron-circle-down c-pointer change-hp"
                          :title="`Decrease ${actor.typeLabel} HP`"
                        ></i>
                      </span>
                    </template>
                  </template>
                  <template v-else-if="actor.size">
                    <input
                      type="number"
                      class="form-control form-control-sm border-dark"
                      v-model="actor.tempSize"
                      v-if="actor.editing"
                      min="4"
                      max="12"
                      step="2"
                      @keypress.enter="actor.saveEdit()"
                      @keydown.esc="actor.cancelEdit()"
                    />
                    <img
                      :src="`images/d${actor.size}.png`"
                      :title="`This ${actor.typeLabel} uses a d${actor.size}`"
                      v-else
                    />
                  </template>
                  <template v-else>-</template>
                </td>
                <!-- Actions -->
                <td class="align-middle">
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-secondary border-dark"
                      @click="editActor(actor, index)"
                      :title="`Edit this ${actor.typeLabel}`"
                      v-if="actor.allowEdit && !actor.editing"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-success border-dark"
                      @click="actor.saveEdit()"
                      v-if="actor.editing"
                      :title="`Save edits on this ${actor.typeLabel}`"
                    >
                      <i class="fas fa-save"></i>
                    </button>
                    <button
                      class="btn btn-warning border-dark"
                      @click="actor.cancelEdit()"
                      v-if="actor.editing"
                      :title="`Cancel edits on this ${actor.typeLabel}`"
                    >
                      <i class="fas fa-ban"></i>
                    </button>
                    <button
                      class="btn btn-primary border-dark add-minion"
                      title="Add a Minion"
                      @click="$emit('add-minion', actor.id)"
                      v-if="actor.allowAddMinion"
                    >
                      <span class="fa-stack">
                        <i class="fas fa-dragon" transform="right-4 down-4"></i>
                        <i
                          class="fas fa-plus"
                          transform="shrink-6 left-4 down-4"
                        ></i>
                      </span>
                    </button>
                    <button
                      class="btn btn-danger border-dark"
                      @click="actor.remove()"
                      :title="`Remove this ${actor.typeLabel} from the scene`"
                      v-if="actor.allowRemove"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <button
                      class="btn btn-secondary border-dark"
                      @click="scroll(actor)"
                      title="See Details"
                      v-if="actor.viewDetails"
                    >
                      <i class="fas fa-eye" title="View Details" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div v-else class="text-center">There are no actors in the scene.</div>
      </div>
    </div>
    <Modal :isOpen="showCreateModal">
      <template v-slot:header
        ><h5 class="modal-title">Add a Player</h5></template
      >
      <template v-slot:body>
        <div class="input-group input-group-sm">
          <span class="input-group-text border-dark">Name</span>
          <input
            type="text"
            v-model.trim="newPlayer.name"
            class="form-control border-dark"
            @keypress.enter="addPlayer"
            ref="newPlayerName"
          />
        </div>
        <div class="input-group input-group-sm mt-2">
          <span class="input-group-text border-dark">Max HP</span>
          <input
            type="number"
            v-model.number="newPlayer.maxHp"
            class="form-control border-dark"
            @keypress.enter="addPlayer"
            min="17"
            max="40"
          />
          <span class="input-group-text border-dark">Current HP</span>
          <input
            type="number"
            v-model.number="newPlayer.hp"
            class="form-control border-dark"
            @keypress.enter="addPlayer"
            min="0"
            :max="newPlayer.maxHp"
            ref="newPlayerHP"
          />
        </div>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-success border-dark"
          type="button"
          @click="addPlayer"
          :disabled="newPlayer.name === ''"
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
import { mapGetters } from "vuex";

import Modal from "components/general/modal.vue";

export default defineComponent({
  name: "RoundTracker",
  components: { Modal },
  data() {
    return {
      newPlayer: {
        name: "",
        hp: 30,
        maxHp: 30,
      },
      showCreateModal: false,
    };
  },
  computed: {
    ...mapGetters(["actors"]),
  },
  methods: {
    addPlayer() {
      if (this.newPlayer.name !== "") {
        this.$store.dispatch("addPlayer", this.newPlayer);
        this.showCreateModal = false;
      }
    },
    clearPlayers() {
      // this.$dialog
      //   .confirm(
      //     {
      //       title: "Are You Sure?",
      //       body: "Are you sure you want to clear all players from the scene? Note: This will not remove any minions, lieutenants, or villains.",
      //     },
      //     {
      //       okText: "Yes",
      //       cancelText: "No",
      //     }
      //   )
      //   .then((r) => {
      //     this.$store.dispatch("resetPlayers");
      //   });
    },
    scroll(actor) {
      $("html, body").animate(
        {
          scrollTop: $(`#${actor.type}${actor.id}`).offset().top,
        },
        800,
        () => {
          window.location.hash = actor.id;
        }
      );
    },
    editActor(actor, index) {
      actor.beginEdit();
      this.$nextTick(() => {
        this.$refs.nameEdit[index].focus();
      });
    },
  },
  watch: {
    "newPlayer.maxHp"(newVal) {
      if (this.newPlayer.hp > newVal) this.newPlayer.hp = newVal;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.module.scss";

img {
  max-width: 20px;
  margin: 0 0.25rem;
}

.hp-green {
  color: $success-light-1;
}
.hp-yellow {
  color: $warning;
}
.hp-red {
  color: $danger-light-1;
}
.hp-incapacitated {
  color: $gray-6;
}

.change-hp {
  margin-left: 0.25rem;

  &:hover {
    transform: translate(0px, -1px);
  }
}

.add-minion {
  width: 40px;

  .fa-stack {
    left: -4px;
  }
}

input.hp {
  width: 30px;
}
</style>
