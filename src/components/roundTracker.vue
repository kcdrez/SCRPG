<template>
  <div>
    <div class="card">
      <div class="card-header text-center">
        <h3>Round Tracker</h3>
        <button class="btn btn-sm btn-danger border-dark mb-2"
                @click="$store.dispatch('resetRound')"
                title="Reset the round, marking all actors as not yet acted">Reset Round Tracker</button>
        <div class="w-auto">
          <span class="mr-1">Players:</span>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-success border-dark"
                    data-toggle="modal"
                    data-target="#addPlayerModal"
                    title="Add a new player to the scene">Add</button>
            <button class="btn btn-warning border-dark"
                    title="Remove all players from the scene"
                    @click="clearPlayers">Clear</button>
            <button class="btn btn-primary border-dark"
                    @click="$refs.import.click()">Import</button>
            <button class="btn btn-secondary border-dark"
                    title="Export the player data to an xlsx file"
                    @click="$store.dispatch('export', { type: 'players', fileName: 'players' })">Export</button>
          </div>
          <input type="file"
                 accept=".xlsx"
                 class="d-none"
                 ref="import"
                 @change="$store.dispatch('import', { files: $event.target.files, filters: ['player', 'minions', 'bonus', 'penalty', 'defend'] })">
        </div>
      </div>
      <div class="card-body">
        <table class="table table-sm table-bordered table-dark table-striped"
              v-if="actors.length > 0">
          <thead class="text-center">
            <tr>
              <th width="28%">Name (Owner)</th>
              <th width="22%">Type (Count)</th>
              <th width="20%">HP/Die Size</th>
              <th width="30%">Actions</th>
            </tr>
          </thead>
          <tbody class="text-center">
            <template v-for="actor in actors">
              <tr v-if="!!actor.name"
                  :key="actor.id"
                  :id="actor.type === 'player' ? actor.id : ''">
                <!-- Name/Owner -->
                <td class="text-capitalize c-pointer align-middle">
                  <input class="form-control form-control-sm"
                        v-model="actor.tempName"
                        v-if="actor.editing">
                  <div v-else
                       @click="actor.takenAction()"
                       :title="`Click to toggle this ${actor.typeLabel} to have acted already in the current round`">
                    <span v-if="actor.acted">
                      <icon :icon="['fas', 'check']"
                            class="text-success" />
                    </span>
                    {{actor.name}}
                    <sup v-if="actor.owner"
                         :title="`This ${actor.typeLabel} belongs to ${actor.owner.name}`"
                         class="c-help"
                         :class="{'text-success': actor.owner.type === 'player', 
                          'text-warning': actor.owner.type === 'scene', 
                          'text-danger': actor.owner.type === 'villains' }">
                      <icon :icon="['fas', 'user']"></icon>
                    </sup>
                    <sup class="text-success c-help" 
                          v-if="actor.bonuses && actor.bonuses.length"
                          :title="`This ${actor.typeLabel} has ${actor.bonuses.length} Bonus${actor.bonuses.length > 1 ? 'es': ''}`">
                      {{actor.bonuses.length}}
                    </sup>
                    <sup class="text-warning c-help" 
                          v-if="actor.penalties && actor.penalties.length"
                          :title="`This ${actor.typeLabel} has ${actor.penalties.length} Penalt${actor.penalties.length > 1 ? 'ies': 'y'}`">
                      {{actor.penalties.length}}
                    </sup>
                    <sup class="text-secondary c-help" 
                          v-if="actor.defends && actor.defends.length"
                          :title="`This ${actor.typeLabel} has ${actor.defends.length} Defend${actor.defends.length > 1 ? 's': ''}`">
                      {{actor.defends.length}}
                    </sup>
                  </div>
                </td>
                <!-- Type/Count -->
                <td class="text-capitalize c-pointer align-middle">
                  <div v-if="!actor.count || (!actor.editing && actor.count)"
                        @click="actor.takenAction()"
                        :title="`Click to toggle this ${actor.typeLabel} to have acted already in the current round`">
                    {{actor.typeLabel}}
                    <template v-if="actor.count">
                      ({{actor.count}})
                    </template>
                  </div>
                  <input type="number"
                          class="form-control form-control-sm"
                          v-model="actor.tempCount"
                          v-if="actor.count && actor.editing"
                          min="1"
                          max="100"
                          @keydown.enter="actor.saveEdit()">
                </td>
                <!-- HP/Die Size -->
                <td class="align-middle">
                  <template v-if="typeof actor.hp === 'number'">
                    <input type="number"
                           class="form-control form-control-sm"
                           v-model.number="actor.tempHP"  
                           v-if="actor.editing"
                           min="0"
                           :max="actor.maxHp">
                    <template v-else>
                      <span :class="'hp-' + actor.zone">{{actor.hp}}</span>
                      <span @click="actor.hp++">
                        <icon :icon="['fas', 'chevron-circle-up']"
                              :title="`Increase ${actor.typeLabel} HP`"
                              class="c-pointer change-hp" />
                      </span>
                      <span @click="actor.hp--">
                        <icon :icon="['fas', 'chevron-circle-down']" 
                              :title="`Decrease ${actor.typeLabel} HP`"
                              class="c-pointer change-hp" />
                      </span>
                    </template>
                  </template>
                  <template v-else-if="actor.size">
                    <input type="number"
                            class="form-control form-control-sm"
                            v-model="actor.tempSize"
                            v-if="actor.editing"
                            min="4"
                            max="12"
                            step="2"
                            @keydown.enter="actor.saveEdit()">
                    <img :src="`/images/d${actor.size}.png`"
                          :title="`This ${actor.typeLabel} uses a d${actor.size}`"
                          v-else>
                  </template>
                  <template v-else>-</template>
                </td>
                <!-- Actions -->
                <td class="align-middle">
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-secondary border-dark"
                            @click="actor.beginEdit()"
                            :title="`Edit this ${actor.typeLabel}`"
                            v-if="actor.allowEdit && !actor.editing">
                      <icon :icon="['far', 'edit']" />
                    </button>
                    <button class="btn btn-success border-dark"
                            @click="actor.saveEdit()"
                            v-if="actor.editing"
                            :title="`Save edits on this ${actor.typeLabel}`">
                      <icon :icon="['far', 'save']" />
                    </button>
                    <button class="btn btn-warning border-dark"
                            @click="actor.cancelEdit()"
                            v-if="actor.editing"
                            :title="`Cancel edits on this ${actor.typeLabel}`">
                      <icon :icon="['fas', 'ban']" />
                    </button>
                    <button class="btn btn-primary border-dark add-minion"
                            title="Add a Minion"
                            @click="$emit('add-minion', actor.id)"
                            v-if="actor.allowAddMinion">
                      <span class="fa-stack">
                        <icon :icon="['fas', 'dragon']" 
                              transform="right-4 down-4" />
                        <icon :icon="['fas', 'plus']" 
                              transform="shrink-6 left-4 down-4" />
                      </span>
                    </button>
                    <button class="btn btn-danger border-dark"
                            @click="actor.remove()" 
                            :title="`Remove this ${actor.typeLabel} from the scene`"
                            v-if="actor.allowRemove">
                      <icon :icon="['far', 'trash-alt']" />
                    </button>
                    <button class="btn btn-secondary border-dark"
                            @click="scroll(actor)"
                            title="See Details"
                            v-if="actor.viewDetails">
                      <icon :icon="['fas', 'eye']"
                            title="View Details"></icon>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div v-else
             class="text-center">
          There are no actors in the scene.
        </div>
      </div>
    </div>
    <div id="addPlayerModal"
         class="modal"
         tabindex="-1"
         role="dialog">
      <div class="modal-dialog"
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a Player</h5>
            <button type="button"
                    class="close"
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">Name</span>
              </div>
              <input type="text"
                    v-model.trim="newPlayer.name"
                    class="form-control form-control-sm"
                    @keypress.enter="addPlayer"
                    ref="newPlayerName">
            </div>
            <div class="input-group input-group-sm mt-2">
              <div class="input-group-prepend">
                <span class="input-group-text">Max HP</span>
              </div>
              <input type="number"
                     v-model.number="newPlayer.maxHp"
                     class="form-control"
                     @keypress.enter="addPlayer"
                     min="17"
                     max="40">
              <div class="input-group-prepend">
                <span class="input-group-text">Current HP</span>
              </div>
              <input type="number"
                     v-model.number="newPlayer.hp"
                     class="form-control"
                     @keypress.enter="addPlayer"
                     min="0"
                     :max="newPlayer.maxHp"
                     ref="newPlayerHP">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success border-dark"
                    type="button"
                    data-dismiss="modal"
                    @click="addPlayer"
                    :disabled="newPlayer.name === ''">Create</button>
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
  import { mapState, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        newPlayer: {
          name: '',
          hp: 30,
          maxHp: 30
        }
      }
    },
    computed: {
      ...mapGetters([
        'actors'
      ])
    },
    methods: {
      addPlayer() {
        if (this.newPlayer.name !== '') {
          this.$store.dispatch('addPlayer', this.newPlayer);
          $('#addPlayerModal').modal('hide');
        }
      },
      clearPlayers() {
        this.$dialog.confirm({
          title: 'Are You Sure?',
          body: 'Are you sure you want to clear all players from the scene? Note: This will not remove any minions, lieutenants, or villains.',
        }, {
          okText: 'Yes',
          cancelText: 'No'
        })
        .then(r => {
          this.$store.dispatch('resetPlayers');
        });
      },
      scroll(actor) {
        $('html, body').animate({
          scrollTop: $(`#${actor.type}${actor.id}`).offset().top
        }, 800, () => {
          window.location.hash = actor.id;
        });
      }
    },
    mounted() {
      $('#addPlayerModal').on('shown.bs.modal', e => {
        this.$refs.newPlayerName.focus();
      });
    },
    watch: {
      'newPlayer.maxHp'(newVal) {
        if (this.newPlayer.hp > newVal) this.newPlayer.hp = newVal;
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles/variables';

  img {
    max-width: 20px;
    margin: 0 .25rem;
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

  .change-hp:hover {
    transform: translate(0px, -1px);
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