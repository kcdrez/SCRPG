<template>
  <div class="player-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h2 class="section-header">Players</h2>
        <div class="btn-group btn-group-sm my-auto">
          <button
            class="btn btn-sm btn-success border-dark"
            @click="$dialog.createActor({ type: 'Player' })"
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
              exportData({
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
            importData({
              filters: ['player', 'bonus', 'penalty', 'defend'],
              files: $event.target.files,
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
            <tr :id="player.elementId">
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
              <td class="align-middle" :id="player.id">
                <div
                  class="btn-group btn-group-sm w-100 mb-2 actions"
                  role="group"
                >
                  <button
                    class="btn btn-success border-dark"
                    title="Add a Bonus to this Player"
                    @click="
                      $dialog.modifyActor({ type: 'Bonus', target: player })
                    "
                  >
                    <img src="images/boost.png" />
                  </button>
                  <button
                    class="btn btn-warning border-dark"
                    title="Add a Penalty to this Player"
                    @click="
                      $dialog.modifyActor({ type: 'Penalty', target: player })
                    "
                  >
                    <img src="images/hinder.png" />
                  </button>
                  <button
                    class="btn btn-success border-dark"
                    title="Add a Defend to this Player"
                    @click="
                      $dialog.modifyActor({ type: 'Defend', target: player })
                    "
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
                      exportData({
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
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

import Modifier from "./modifier.vue";
import { sortActors } from "scripts/actor";

export default defineComponent({
  name: "PlayerList",
  components: {
    Modifier,
  },
  data() {
    return {
      newPlayer: {
        name: "",
        hp: 30,
        maxHp: 30,
      },
    };
  },
  computed: {
    ...mapState(["players"]),
  },
  methods: {
    ...mapActions({
      exportData: "export",
      importData: "import",
      addPlayer: "addPlayer",
    }),
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
@import "styles/variables.module.scss";

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
