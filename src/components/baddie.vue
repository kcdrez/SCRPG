<template>
  <div class="baddie-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h2>
          <a :href="`#${label}-Data`" 
             data-toggle="collapse">{{label}}</a>
        </h2>
        <div class="btn-group btn-group-sm my-auto">
          <button class="btn btn-sm btn-success border-dark" 
                  data-toggle="modal" 
                  :data-target="`#createModal-${label}`">Create</button>
          <button class="btn btn-primary border-dark"
                    @click="$refs.import.click()"
                    :title="`Import ${labelSingle} data from an xlsx file`">Import</button>
          <button class="btn btn-secondary border-dark"
                    @click="$store.dispatch('export', {type: label.toLowerCase(), fileName: label})"
                    :title='`Export all ${label} to an xlsx file`'
                    :disabled="list.length === 0">Export</button>
        </div>
        <input type="file"
               accept=".xlsx"
               class="d-none"
               ref="import"
               @change="$store.dispatch('import', {files: $event.target.files, filters: [label.toLowerCase(),
                'bonus', 'penalty', 'defend']})">
      </div>
    </div>
    <div :id="`${label}-Data`" 
         class="collapse show row">
      <div class="col mb-2" 
           v-if="list.length === 0">
        There are no {{label}}.
      </div>
      <table class="table table-sm table-striped table-bordered table-dark col" 
             v-else>
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
          <template v-for="baddie in list">
            <tr :key="baddie.id">
              <td class="text-center align-middle text-capitalize">
                <template v-if="baddie.editing">
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                      <div class="input-group-text">Name</div>
                    </div>
                    <input class="form-control" 
                           v-model.trim="baddie.tempName" 
                           type="text"
                           @keydown.enter="baddie.saveEdit()">
                  </div>
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                      <div class="input-group-text">Owner</div>
                    </div>
                    <select class="form-control"
                            @keydown.enter="baddie.saveEdit()"
                            v-model="baddie.tempOwner">
                      <option :value="null">-</option>
                      <option v-for="player in players"
                              :key="player.id"
                              :value="player.id">{{player.name}}</option>
                      <option v-for="villain in villains"
                              :key="villain.id"
                              :value="villain.id">{{villain.name}}</option>
                      <option v-if="scene.name" :value="scene.id">{{scene.name}}</option>
                    </select>
                  </div>
                </template>
                <template v-else>
                  <div>{{baddie.name}}</div>
                  <div v-if="baddie.owner">({{baddie.owner.name}})</div>
                </template>
              </td>
              <td class="text-center align-middle">
                <input type="number"
                       class="form-control form-control-sm"
                       v-model="baddie.tempSize"
                       v-if="baddie.editing"
                       min="4"
                       max="12"
                       step="2">
                <img :src="`images/d${baddie.size}.png`" 
                     :title="`This minion uses a d${baddie.size}`"
                     v-else>
              </td>
              <td class="text-center align-middle">
                <input type="number"
                       class="form-control form-control-sm"
                       v-model="baddie.tempCount"
                       v-if="baddie.editing"
                       min="1">
                <template v-else>{{baddie.count}}</template>
              </td>
              <td>
                <Modifier label="bonus"
                          labelPlural="bonuses"
                          :list="baddie.bonuses"
                          :editing="baddie.editing"
                          @remove="baddie.removeModifier('bonuses', $event)"
                          @save-edit="baddie.saveEdit()"></Modifier>
                <Modifier label="penalty"
                          labelPlural="penalties"
                          :list="baddie.penalties"
                          :editing="baddie.editing"
                          @remove="baddie.removeModifier('penalties', $event)"
                          @save-edit="baddie.saveEdit()"></Modifier>
                <Modifier label="defend" 
                          labelPlural="defends" 
                          :list="baddie.defends"
                          :editing="baddie.editing"
                          @remove="baddie.removeModifier('defends', $event)"
                          @save-edit="baddie.saveEdit()"></Modifier>                      
              </td>
              <td class="align-middle">
                <div class="btn-group btn-group-sm w-100 mb-2 actions"
                     role="group">
                  <button class="btn btn-success border-dark"
                          :title="`Add a Bonus to this ${baddie.typeLabel}`"
                          @click="modifyBaddie('boost', baddie.id)">
                    <img src="images/boost.png">
                  </button>
                  <button class="btn btn-warning border-dark" 
                          :title="`Add a Penalty to this ${baddie.typeLabel}`"
                          @click="modifyBaddie('hinder', baddie.id)">
                    <img src="images/hinder.png">
                  </button>
                  <button class="btn btn-secondary border-dark" 
                         :title="`Add a Defend to this ${baddie.typeLabel}`"
                         @click="modifyBaddie('defend', baddie.id)">
                    <img src="images/defend.png">
                  </button>
                </div>
                <div class="btn-group btn-group-sm w-100 actions">
                  <button class="btn btn-warning border-dark text-dark" 
                          :title="`Demote this ${baddie.typeLabel} one die size (min 4)`"
                          @click="baddie.demote()" 
                          :disabled="baddie.size <= 4">
                    <icon :icon="['fas', 'level-down-alt']" />
                  </button>
                  <button class="btn btn-success border-dark text-dark" 
                          :title="`Promote this ${baddie.typeLabel} one die size (max 12)`"
                          @click="baddie.promote()" 
                          :disabled="baddie.size >= 12">
                    <icon :icon="['fas', 'level-up-alt']" />
                  </button>
                  <button class="btn btn-info border-dark text-dark" 
                          :title="`Add another ${baddie.typeLabel} to this row`"
                          @click="baddie.count++">
                    <icon :icon="['far', 'plus-square']" />
                  </button>
                  <button class="btn btn-danger border-dark text-dark"
                          :title="`Remove one ${baddie.typeLabel} from this group from the scene`"
                          @click="baddie.count--">
                    <icon :icon="['far', 'trash-alt']" />
                  </button>
                  <button class="btn btn-secondary border-dark text-light" 
                          :title="`Edit this ${baddie.typeLabel}`"
                          @click="baddie.beginEdit()"
                          v-if="baddie.allowEdit && !baddie.editing">
                    <icon :icon="['far', 'edit']" />
                  </button>
                  <button class="btn btn-success border-dark text-light" 
                          :title="`Save edits on this ${baddie.typeLabel}`"
                          @click="baddie.saveEdit()"
                          v-if="baddie.editing">
                    <icon :icon="['far', 'save']" />
                  </button>
                  <button class="btn btn-warning border-dark"
                          @click="baddie.cancelEdit()"
                          v-if="baddie.editing"
                          :title="`Cancel edits on this ${baddie.typeLabel}`">
                    <icon :icon="['fas', 'ban']" />
                  </button>
                  <button class="btn btn-secondary border-dark"
                          @click="$store.dispatch('export', {type: label.toLowerCase(), fileName: label, id: baddie.id})"
                          :title='`Export this ${baddie.typeLabel} to an xlsx file`'>
                    <icon :icon="['fas', 'file-download']" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div :id="`createModal-${label}`" 
          class="modal" 
          tabindex="-1" 
          role="dialog">
      <div class="modal-dialog" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create a {{labelSingle}}</h5>
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
                     v-model.trim="baddieData.name" 
                     type="text"
                     @keydown.enter="createBaddie()"
                     ref="createName">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Size</div>
              </div>
              <input class="form-control" 
                     v-model.number="baddieData.size" 
                     type="number" 
                     step="2" 
                     min="4" 
                     max="12"
                     @keydown.enter="createBaddie()">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Count</div>
              </div>
              <input class="form-control" 
                     v-model.number="baddieData.count" 
                     type="number" 
                     min="1"
                     @keydown.enter="createBaddie()">
            </div>
            <div class="input-group input-group-sm mb-3"
                 v-if="allowOwner">
              <div class="input-group-prepend">
                <div class="input-group-text">Owner</div>
              </div>
              <select class="form-control"
                      @keydown.enter="createBaddie()"
                      v-model="baddieData.owner">
                <option :value="null">-</option>
                <option v-for="player in players"
                        :key="player.id"
                        :value="player.id">{{player.name}}</option>
                <option v-for="villain in villains"
                        :key="villain.id"
                        :value="villain.id">{{villain.name}}</option>
                <option v-if="scene.name" :value="scene.id">{{scene.name}}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" 
                    type="button" 
                    data-dismiss="modal" 
                    @click="createBaddie()">Create</button>
            <button class="btn btn-secondary" 
                    type="button" 
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div :id="`modifierModal-${label}`" 
         class="modal" 
         tabindex="-1" 
         role="dialog">
      <div class="modal-dialog" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a {{baddieData.modifier.type}}</h5>
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
                     type="text"
                     v-model.trim="baddieData.modifier.name"
                     @keydown.enter="addModifier">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Amount</div>
              </div>
              <input class="form-control" 
                     v-model.number="baddieData.modifier.amount" 
                     type="number" 
                     :max="baddieData.modifier.max"
                     :min="baddieData.modifier.min"
                     @keydown.enter="addModifier">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Apply To</div>
              </div>
              <select class="form-control"
                     v-model.number="baddieData.modifier.applyTo" 
                     @keydown.enter="addModifier">
                <option value="single">Just one</option>
                <option value="row">All of the {{label.toLowerCase()}} in this row</option>
                <option value="name">All of the {{label.toLowerCase()}} with the same name</option>
              </select>
            </div>
            <div class="d-inline" 
                 v-if="baddieData.modifier.type !== 'Defend'">
              <label :for="`persistent-${labelSingle}`"
                     class="c-pointer">Persistent?</label>
              <input type="checkbox"
                     v-model="baddieData.modifier.persistent"
                     @keydown.enter="addModifier"
                     :id="`persistent-${labelSingle}`">
            </div>
            <div class="d-inline mx-3" 
                 v-if="baddieData.modifier.type !== 'Defend'">
              <label :for="`exclusive-${labelSingle}`"
                     class="c-pointer">Exclusive?</label>
              <input type="checkbox" 
                     v-model="baddieData.modifier.exclusive"
                     @keydown.enter="addModifier"
                     :id="`exclusive-${labelSingle}`">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" 
                    class="btn btn-primary" 
                    @click="addModifier"
                    :disabled="baddieData.modifier.name === ''">Add</button>
            <button type="button" 
                    class="btn btn-secondary" 
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import { Baddie } from '../scripts/baddie';
  import { mapState } from 'vuex';
  import Modifier from './modifier.vue';
  import { unvue } from '../scripts/utilities';
  import { sortActors } from '../scripts/actor';

  export default {
    name: 'BaddieList',
    components: {
      Modifier
    },
    props: {
      label: {
        type: String,
        required: true
      },
      allowOwner: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        baddieData: {
          name: '',
          size: 8,
          count: 1,
          owner: null,
          modifier: {
            amount: 0,
            name: '',
            max: 0,
            min: 0,
            type: '',
            target: null,
            persistent: false,
            exclusive: false,
            applyTo: 'single'
          }
        }
      }
    },
    computed: {
      list() {
        return this.$store.state[this.label.toLowerCase()].sort(sortActors);
      },
      ...mapState([
        'players',
        'villains',
        'scene'
      ]),
      labelSingle() {
        switch (this.label) {
          case 'Minions':
          default:
            return 'Minion';
          case 'Lieutenants':
            return 'Lieutenant';
        }
      }
    },
    methods: {
      createBaddie(baddie) {
        this.$store.dispatch('upsertBaddie', Object.assign({type: this.label.toLowerCase()}, this.baddieData));
        $(`#createModal-${this.label}`).modal('hide');
      },
      addBaddie(name) {
        this.baddieData.name = name;
        $(`#createModal-${this.label}`).modal('show');
      },
      modifyBaddie(type, id) {
        if (type === 'boost') {
          this.baddieData.modifier.max = 4;
          this.baddieData.modifier.min = 1;
          this.baddieData.modifier.amount = 1;
          this.baddieData.modifier.type = 'Bonus';
        } else if (type === 'hinder') {
          this.baddieData.modifier.max = -1;
          this.baddieData.modifier.min = -4;
          this.baddieData.modifier.amount = -1;
          this.baddieData.modifier.type = 'Penalty';
        } else if (type === 'defend') {
          this.baddieData.modifier.max = 100;
          this.baddieData.modifier.min = 1;
          this.baddieData.modifier.amount = 1;
          this.baddieData.modifier.type = 'Defend';
          this.baddieData.modifier.persistent = false;
          this.baddieData.modifier.exclusive = false;
        } else {
          return;
        }
        this.baddieData.modifier.target = id;
        $(`#modifierModal-${this.label}`).modal('show');
      },
      addModifier() {
        if (this.baddieData.modifier.name !== '') {
          this.$store.dispatch('modifyBaddie', {type: this.label.toLowerCase(), modifier: this.baddieData.modifier});
          $(`#modifierModal-${this.label}`).modal('hide');
        }
      },
      modal(status, owner) {
        $(`#createModal-${this.label}`).modal(status);
        this.baddieData.owner = owner || null;
        this.$nextTick(() => {
          this.$refs.createName.focus();
        });
      }
    }
  };
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