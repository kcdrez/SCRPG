<template>
  <div class="player-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h2 class="section-header">Players</h2>
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
            :title="`Import Player data from an xlsx file`"
          >
            Import
          </button>
          <button
            class="btn btn-secondary border-dark"
            @click="
              $store.dispatch('export', {
                type: 'player',
                fileName: 'players',
              })
            "
            title="Export all Players to an xlsx file"
            :disabled="players.length === 0"
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
              filters: ['player', 'bonus', 'penalty', 'defend'],
            })
          "
        />
      </div>
    </div>
    <div id="playerData" class="collapse show row">
      <div class="col mb-2" v-if="players.length === 0">
        There are no Players.
      </div>
      <table
        class="table table-sm table-striped table-bordered table-dark col"
        v-else
      >
        <thead class="text-center">
          <tr>
            <th width="15%">Name</th>
            <th width="25%">Modifiers</th>
            <th width="30%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="player in players" :key="player.name">
            <tr :id="player.name">
              <!-- Name -->
              <td class="text-center align-middle text-capitalize">
                <template v-if="player.editing">
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-text border-dark">Name</div>
                    <input
                      class="form-control border-dark"
                      v-model.trim="player.tempName"
                      type="text"
                      @keypress.enter="player.saveEdit()"
                      @keydown.esc="player.cancelEdit()"
                      ref="nameEdit"
                    />
                  </div>
                  <div class="input-group input-group-sm mt-2">
                    <span class="input-group-text border-dark">Max HP</span>
                    <input
                      type="number"
                      v-model.number="player.maxHp"
                      class="form-control border-dark"
                      min="17"
                      max="40"
                    />
                    <span class="input-group-text border-dark">Current HP</span>
                    <input
                      type="number"
                      v-model.number="player.hp"
                      class="form-control border-dark"
                      min="0"
                      :max="player.maxHp"
                    />
                  </div>
                </template>
                <div v-else>
                  {{ player.name }}
                  <div>
                    <span :class="'hp-' + player.zone">{{ player.hp }}</span>
                    <span @click="player.hp++">
                      <i
                        class="fas fa-chevron-circle-up c-pointer change-hp"
                        :title="`Increase ${player.typeLabel} HP`"
                      ></i>
                    </span>
                    <span @click="player.hp--">
                      <i
                        class="fas fa-chevron-circle-down c-pointer change-hp"
                        :title="`Decrease ${player.typeLabel} HP`"
                      ></i>
                    </span>
                  </div>
                </div>
              </td>
              <!-- Modifiers -->
              <td>
                <Modifier
                  label="bonus"
                  labelPlural="bonuses"
                  :list="player.bonuses"
                  :editing="player.editing"
                  @remove="player.removeModifier('bonuses', $event)"
                  @save-edit="player.saveEdit()"
                  @cancel-edit="player.cancelEdit()"
                ></Modifier>
                <Modifier
                  label="penalty"
                  labelPlural="penalties"
                  :list="player.penalties"
                  :editing="player.editing"
                  @remove="player.removeModifier('penalties', $event)"
                  @save-edit="player.saveEdit()"
                  @cancel-edit="player.cancelEdit()"
                ></Modifier>
                <Modifier
                  label="defend"
                  labelPlural="defends"
                  :list="player.defends"
                  :editing="player.editing"
                  @remove="player.removeModifier('defends', $event)"
                  @save-edit="player.saveEdit()"
                  @cancel-edit="player.cancelEdit()"
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
                    title="Add a Bonus to this Player"
                    @click="modifyPlayer('boost', player.id)"
                  >
                    <img src="images/boost.png" />
                  </button>
                  <button
                    class="btn btn-warning border-dark"
                    title="Add a Penalty to this Player"
                    @click="modifyPlayer('hinder', player.id)"
                  >
                    <img src="images/hinder.png" />
                  </button>
                  <button
                    class="btn btn-success border-dark"
                    title="Add a Defend to this Player"
                    @click="modifyPlayer('defend', player.id)"
                  >
                    <img src="images/defend.png" />
                  </button>
                </div>
                <div class="btn-group btn-group-sm w-100 actions">
                  <button
                    class="btn btn-secondary border-dark text-dark"
                    title="Edit this Player"
                    @click="editPlayer(player)"
                    v-if="player.allowEdit && !player.editing"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-success border-dark text-dark"
                    title="Save edits on this Player"
                    @click="player.saveEdit()"
                    v-if="player.editing"
                  >
                    <i class="fas fa-save"></i>
                  </button>
                  <button
                    class="btn btn-warning border-dark text-dark"
                    @click="player.cancelEdit()"
                    v-if="player.editing"
                    title="Cancel edits on this Player"
                  >
                    <i class="fas fa-ban"></i>
                  </button>
                  <button
                    class="btn btn-secondary border-dark text-dark"
                    @click="
                      $store.dispatch('export', {
                        type: 'player',
                        fileName: player.name,
                        id: player.id,
                      })
                    "
                    title="Export this Player to an xlsx file"
                  >
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
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
            @keypress.enter="createPlayer"
            ref="newPlayerName"
          />
        </div>
        <div class="input-group input-group-sm mt-2">
          <span class="input-group-text border-dark">Max HP</span>
          <input
            type="number"
            v-model.number="newPlayer.maxHp"
            class="form-control border-dark"
            @keypress.enter="createPlayer"
            min="17"
            max="40"
          />
          <span class="input-group-text border-dark">Current HP</span>
          <input
            type="number"
            v-model.number="newPlayer.hp"
            class="form-control border-dark"
            @keypress.enter="createPlayer"
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
          @click="createPlayer"
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
    <Modal :isOpen="showModifierModal">
      <template v-slot:header>Add a {{ modifier.type }}</template>
      <template v-slot:body>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-text border-dark">Name</div>
          <input
            class="form-control border-dark"
            type="text"
            v-model.trim="modifier.name"
            @keydown.enter="addModifier"
            ref="modName"
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
            @keydown.enter="addModifier"
          />
        </div>
        <div class="d-inline" v-if="modifier.type !== 'Defend'">
          <label for="persistent-Player" class="c-pointer">Persistent?</label>
          <input
            type="checkbox"
            v-model="modifier.persistent"
            @keydown.enter="addModifier"
            id="persistent-Player"
          />
        </div>
        <div class="d-inline mx-3" v-if="modifier.type !== 'Defend'">
          <label for="exclusive-Player" class="c-pointer">Exclusive?</label>
          <input
            type="checkbox"
            v-model="modifier.exclusive"
            @keydown.enter="addModifier"
            id="exclusive-Player"
          /></div
      ></template>
      <template v-slot:footer>
        <button
          type="button"
          class="btn btn-primary border-dark"
          @click="addModifier"
          :disabled="modifier.name === ''"
        >
          Add
        </button>
        <button
          type="button"
          class="btn btn-secondary border-dark"
          data-dismiss="modal"
          @click="showModifierModal = false"
        >
          Close
        </button></template
      >
    </Modal>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

import Modifier from "./modifier.vue";
import { sortActors } from "../scripts/actor";
import Modal from "components/general/modal.vue";
import { unvue } from "../scripts/utilities.js";

export default defineComponent({
  name: "PlayerList",
  components: {
    Modifier,
    Modal,
  },
  data() {
    return {
      showCreateModal: false,
      showModifierModal: false,
      newPlayer: {
        name: "",
        hp: 30,
        maxHp: 30,
      },
      modifier: {
        amount: 0,
        name: "",
        max: 0,
        min: 0,
        type: "",
        persistent: false,
        exclusive: false,
        target: null,
      },
    };
  },
  computed: {
    ...mapState(["players"]),
  },
  methods: {
    ...mapActions(["addPlayer"]),
    createPlayer() {
      this.addPlayer(unvue(this.newPlayer));
      this.showCreateModal = false;
    },
    modifyPlayer(type, playerId) {
      if (type === "boost") {
        this.modifier.max = 4;
        this.modifier.min = 1;
        this.modifier.amount = 1;
        this.modifier.type = "Bonus";
      } else if (type === "hinder") {
        this.modifier.max = -1;
        this.modifier.min = -4;
        this.modifier.amount = -1;
        this.modifier.type = "Penalty";
      } else if (type === "defend") {
        this.modifier.max = 100;
        this.modifier.min = 1;
        this.modifier.amount = 1;
        this.modifier.type = "Defend";
        this.modifier.persistent = false;
        this.modifier.exclusive = false;
      } else {
        return;
      }
      this.modifier.targetId = playerId;
      this.showModifierModal = true;
    },
    addModifier() {
      if (this.modifier.name !== "") {
        this.$store.dispatch("modifyPlayer", {
          modifier: this.modifier,
        });
        this.showModifierModal = false;
      }
    },
    editPlayer(player, index) {
      player.beginEdit();
      // this.$nextTick(() => {
      //   this.$refs.nameEdit[index].focus();
      // });
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.module.scss";

.player-list {
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
</style>
