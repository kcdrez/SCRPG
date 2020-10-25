<template>
  <div class="baddie-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h2>
          <a :href="`#${label}-Data`" 
             data-toggle="collapse">{{label}}</a>
        </h2>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-sm btn-success border-dark" 
                  data-toggle="modal" 
                  :data-target="`#createModal-${label}`">Create</button>
        </div>
      </div>
    </div>
    <div :id="`${label}-Data`" 
         class="collapse show row">
      <div class="col" 
           v-if="list.length === 0">
        There are no {{label}}.
      </div>
      <table class="table table-sm table-striped table-bordered col" 
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
            <tr v-for="(baddieRow, index) in baddie.list" 
                :key="baddie.name + '-' + index">
              <td class="text-center align-middle text-capitalize">
                <div>{{baddie.name}}</div>
                <div v-if="baddie.owner">({{baddie.owner.name}})</div>
                </td>
              <td class="text-center align-middle">
                <img :src="`images/d${baddieRow.size}.png`" 
                     :title="`This minion uses a d${baddieRow.size}`">
              </td>
              <td class="text-center align-middle">
                {{baddieRow.count}}
              </td>
              <td>
                <Modifier label="bonus" 
                      labelPlural="bonuses" 
                      :list="baddieRow.bonuses"
                      @remove="baddie.removeModifier(baddieRow, 'bonuses', $event)"></Modifier>
                <Modifier label="penalty" 
                      labelPlural="penalties" 
                      :list="baddieRow.penalties"
                      @remove="baddie.removeModifier(baddieRow, 'penalties', $event)"></Modifier>
                <Modifier label="defend" 
                      labelPlural="defends" 
                      :list="baddieRow.defends"
                      @remove="baddie.removeModifier(baddieRow, 'defends', $event)"></Modifier>                      
              </td>
              <td class="align-middle">
                <div class="btn-group btn-group-sm w-100 mb-2 actions" 
                     role="group">
                  <button class="btn btn-success border-dark" 
                          :title="`Add a Bonus to this ${label}`"
                          @click="modifyBaddie(baddieRow.size, 'boost', baddie, baddieRow)">
                    <img src="images/boost.png">
                  </button>
                  <button class="btn btn-warning border-dark" 
                          :title="`Add a Penalty to this ${label}`"
                          @click="modifyBaddie(baddieRow.size, 'hinder', baddie, baddieRow)">
                    <img src="images/hinder.png">
                  </button>
                  <button class="btn btn-secondary border-dark" 
                         :title="`Add a Defend to this ${label}`"
                         @click="modifyBaddie(baddieRow.size, 'defend', baddie, baddieRow)">
                    <img src="images/defend.png">
                  </button>
                </div>
                <div class="btn-group btn-group-sm w-100 actions">
                  <button class="btn btn-warning border-dark text-dark" 
                          :title="`Demote this ${label} one die size (min 4)`"
                          @click="demoteBaddie(baddie, baddieRow)" 
                          :disabled="baddieRow.size <= 4">
                    <icon :icon="['fas', 'level-down-alt']" />
                  </button>
                  <button class="btn btn-success border-dark text-dark" 
                          :title="`Promote this ${label} one die size (max 12)`"
                          @click="promoteBaddie(baddie, baddieRow)" 
                          :disabled="baddieRow.size >= 12">
                    <icon :icon="['fas', 'level-up-alt']" />
                  </button>
                  <button class="btn btn-info border-dark text-dark" 
                          :title="`Add another ${label} of this type (and size) to the scene`"
                          @click="createBaddie(baddieRow, baddie.name)">
                    <icon :icon="['far', 'plus-square']" />
                  </button>
                  <button class="btn btn-danger border-dark text-dark"
                          :title="`Remove one ${label} from this group from the scene`"
                          @click="removeBaddie(baddie, baddieRow)">
                    <icon :icon="['far', 'trash-alt']" />
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
            <h5 class="modal-title">Create a {{label}}</h5>
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
                     @keydown.enter="createBaddie()">
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
                <option value="die">All of the same die size</option>
                <option value="name">All of the same name</option>
              </select>
            </div>
            <div class="d-inline" 
                 v-if="baddieData.modifier.type !== 'Defend'">
              <label>Persistent?</label>
              <input type="checkbox" 
                     v-model="baddieData.modifier.persistent"
                     @keydown="addModifier">
            </div>
            <div class="d-inline mx-3" 
                 v-if="baddieData.modifier.type !== 'Defend'">
              <label>Exclusive?</label>
              <input type="checkbox" 
                     v-model="baddieData.modifier.exclusive"
                     @keydown="addModifier">
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
  import {Baddie} from '../scripts/baddie';
  import {mapState} from 'vuex';
  import Modifier from './modifier.vue';
  import {unvue} from '../scripts/utilities';

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
            size: 0,
            target: null,
            parent: null,
            persistent: false,
            exclusive: false,
            applyTo: 'single'
          }
        }
      }
    },
    computed: {
      list() {
        return this.$store.state[this.label.toLowerCase()].sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          } else if (b.name > a.name) {
            return -1;
          } else {
            return 0;
          }
        });
      },
      ...mapState([
        'players',
        'villains'
      ])
    },
    methods: {
      createBaddie(data, name) { 
        if (!!data) {
          data = Object.assign(data, {name});
        } else {
          data = this.baddieData;
        }
        if (!!data.name) {
          const baddie = new Baddie(data, this.label.toLowerCase());
          this.$store.commit('UPSERT_BADDIE', 
            {baddie, baddieType: this.label.toLowerCase()});
          $(`#createModal-${this.label}`).modal('hide');
        }
      },
      addBaddie(name) {
        this.baddieData.name = name;
        $('#createModal-' + this.label).modal('show');
      },
      modifyBaddie(size, type, parent, target) {
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
        this.baddieData.modifier.size = size;
        this.baddieData.modifier.parent = parent;
        this.baddieData.modifier.target = target;
        this.$store.dispatch('saveBaddies', this.label.toLowerCase());
        $(`#modifierModal-${this.label}`).modal('show');
      },
      demoteBaddie(parent, target) {
        parent.demote(target);
        this.$store.dispatch('saveBaddies', this.label.toLowerCase());
      },
      promoteBaddie(parent, target) {
        parent.promote(target);
        this.$store.dispatch('saveBaddies', this.label.toLowerCase());
      },
      removeBaddie(parent, target) {
        parent.remove(target);
        this.$store.dispatch('saveBaddies', this.label.toLowerCase());
      },
      addModifier() {
        if (this.baddieData.modifier.name !== '') {
          this.baddieData.modifier.parent.addModifier(this.baddieData.modifier, this.baddieData.modifier.target);
          $(`#modifierModal-${this.label}`).modal('hide');
        }
      },
      modal(status, owner) {
        $(`#createModal-${this.label}`).modal(status);
        this.baddieData.owner = owner || null;
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
  }
</style>