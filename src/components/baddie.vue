<template>
  <div class="baddie-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h3><a :href="`#${label}-Data`" data-toggle="collapse">{{label}}</a></h3>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-sm btn-success border-dark" 
            data-toggle="modal" :data-target="`#createModal-${label}`">Create</button>
        </div>
      </div>
    </div>
    <div :id="`${label}-Data`" class="collapse show row">
      <div class="col" v-if="list.length === 0">
        There are no {{label}}.
      </div>
      <table class="table table-sm table-striped table-bordered col" v-else>
        <thead class="text-center">
          <tr>
            <th width="10%">Name</th>
            <th width="10%">Die Size</th>
            <th width="10%">Count</th>
            <th width="15%">Bonuses</th>
            <th width="15%">Penalties</th>
            <th width="15%">Defends</th>
            <th width="25%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="baddie in list">
            <tr v-for="(baddieRow, index) in baddie.list" :key="baddie.name + '-' + index">
              <td class="text-center align-middle text-capitalize">{{baddie.name}}</td>
              <td class="text-center align-middle">
                <img :src="`images/d${baddieRow.size}.png`" :title="`This minion uses a d${baddieRow.size}`">
              </td>
              <td class="text-center align-middle">{{baddieRow.count}}</td>
              <td class="text-center">
                <template v-if="baddieRow.bonuses.length === 0">-</template> 
                <div class="border border-dark position-relative" v-for="(bonus, affixIndex) in baddieRow.bonuses" :key="'bonus' + affixIndex">
                  <div class="remove-affix" 
                    title="Remove this Bonus"
                    @click="baddie.removeAffix(baddieRow, 'bonuses', affixIndex)">&times;</div>
                  <div><b>Name: </b>{{bonus.name}}</div>
                  <div><b>Amount: </b>+{{bonus.amount}}</div>
                  <div v-if="bonus.persistent" class="font-italic">Persistent</div>
                  <div v-if="bonus.exclusive" class="font-italic">Exclusive</div>
                </div>
              </td>
              <td class="text-center">
                <template v-if="baddieRow.penalties.length === 0">-</template>
                <div class="border border-dark position-relative" v-for="(penalty, affixIndex) in baddieRow.penalties" :key="'penalty' + affixIndex">
                  <div class="remove-affix" 
                    title="Remove this Penalty"
                    @click="baddie.removeAffix(baddieRow, 'penalties', affixIndex)">&times;</div>
                  <div><b>Name: </b>{{penalty.name}}</div>
                  <div><b>Amount: </b>{{penalty.amount}}</div>
                  <div v-if="penalty.persistent" class="font-italic">Persistent</div>
                  <div v-if="penalty.exclusive" class="font-italic">Exclusive</div>
                </div>
              </td>
              <td class="text-center">
                <template v-if="baddieRow.defends.length === 0">-</template>
                <div class="border border-dark position-relative" v-for="(defend, affixIndex) in baddieRow.defends" :key="'defend' + affixIndex">
                  <div class="remove-affix" 
                    title="Remove this Penalty"
                    @click="baddie.removeAffix(baddieRow, 'defends', affixIndex)">&times;</div>
                  <div><b>Name: </b>{{defend.name}}</div>
                  <div><b>Amount: </b>{{defend.amount}}</div>
                </div>
              </td>
              <td class="align-middle">
                <div class="btn-group btn-group-sm w-100 mb-2" role="group">
                  <button class="btn btn-success border-dark" :title="`Add a Bonus to this ${label}`"
                    @click="affectBaddie(baddieRow.size, 'boost', baddie, baddieRow)">Boost</button>
                  <button class="btn btn-warning border-dark" :title="`Add a Penalty to this ${label}`"
                    @click="affectBaddie(baddieRow.size, 'hinder', baddie, baddieRow)">Hinder</button>
                  <button class="btn btn-secondary border-dark" :title="`Add a Defend to this ${label}`"
                    @click="affectBaddie(baddieRow.size, 'defend', baddie, baddieRow)">Defend</button>
                </div>
                <div class="btn-group btn-group-sm w-100">
                  <button class="btn btn-info border-dark" :title="`Demote this ${label} one die size`"
                    @click="demoteBaddie(baddie, baddieRow)" :disabled="baddieRow.size <= 4">Demote</button>
                  <button class="btn btn-danger border-dark" :title="`Remove one ${label} from this group from the scene`"
                    @click="removeBaddie(baddie, baddieRow)">Remove</button>
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
            <h5 class="modal-title">Create a {{label}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Name</div>
              </div>
              <input class="form-control" v-model.trim="baddieData.name" type="text"
                @keydown.enter="createBaddie">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Size</div>
              </div>
              <input class="form-control" 
                v-model.number="baddieData.size" type="number" step="2" min="4" max="12"
                @keydown.enter="createBaddie">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Count</div>
              </div>
              <input class="form-control" v-model.number="baddieData.count" type="number" min="1"
                @keydown.enter="createBaddie">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="createBaddie">Create</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div :id="`affixModal-${label}`" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a {{baddieData.affix.type}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Name</div>
              </div>
              <input class="form-control" type="text"
                v-model.trim="baddieData.affix.name"
                @keydown.enter="addAffix">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Amount</div>
              </div>
              <input class="form-control" 
                v-model.number="baddieData.affix.amount" 
                type="number" 
                :max="baddieData.affix.max"
                :min="baddieData.affix.min"
                @keydown.enter="addAffix">
            </div>
            <div class="d-inline" v-if="baddieData.affix.type !== 'Defend'">
              <label>Persistent?</label>
              <input type="checkbox" v-model="baddieData.affix.persistent">
            </div>
            <div class="d-inline mx-3" v-if="baddieData.affix.type !== 'Defend'">
              <label>Exclusive?</label>
              <input type="checkbox" v-model="baddieData.affix.exclusive">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" 
              @click="addAffix">Add</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import {Baddie} from '../scripts/baddie';

  export default {
    name: 'BaddieList',
    props: {
      list: {
        type: Array,
        required: true
      },
      label: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        baddieData: {
          name: '',
          size: 8,
          count: 1,
          affix: {
            amount: 0,
            name: '',
            max: 0,
            min: 0,
            type: '',
            size: 0,
            target: null,
            parent: null,
            persistent: false,
            exclusive: false
          }
        }
      }
    },
    methods: {
      createBaddie() {
        const {name, size, count} = this.baddieData;
        if (name !== '') {
          const baddie = new Baddie({
            name, 
            size, 
            count
          }, this.label.toLowerCase());
          this.$store.commit('UPSERT_BADDIE', 
            {baddie, baddieType: this.label.toLowerCase()});
          $(`#createModal-${this.label}`).modal('hide');
        }
      },
      addBaddie(name) {
        this.baddieData.name = name;
        $('#createModal-' + this.label).modal('show');
      },
      affectBaddie(size, type, parent, target) {
        if (type === 'boost') {
          this.baddieData.affix.max = 4;
          this.baddieData.affix.min = 1;
          this.baddieData.affix.amount = 1;
          this.baddieData.affix.type = 'Bonus';
        } else if (type === 'hinder') {
          this.baddieData.affix.max = -1;
          this.baddieData.affix.min = -4;
          this.baddieData.affix.amount = -1;
          this.baddieData.affix.type = 'Penalty';
        } else if (type === 'defend') {
          this.baddieData.affix.max = 100;
          this.baddieData.affix.min = 1;
          this.baddieData.affix.amount = 1;
          this.baddieData.affix.type = 'Defend';
          this.baddieData.affix.persistent = false;
          this.baddieData.affix.exclusive = false;
        } else {
          return;
        }
        this.baddieData.affix.size = size;
        this.baddieData.affix.parent = parent;
        this.baddieData.affix.target = target;
        this.$store.dispatch('saveBaddies', this.label.toLowerCase());
        $(`#affixModal-${this.label}`).modal('show');
      },
      demoteBaddie(parent, target) {
        parent.demote(target);
        this.$store.dispatch('saveBaddies', this.label.toLowerCase());
      },
      removeBaddie(parent, target) {
        parent.remove(target);
        this.$store.dispatch('saveBaddies', this.label.toLowerCase());
      },
      addAffix() {
        if (this.baddieData.affix.name !== '') {
          this.baddieData.affix.parent.addAffix(this.baddieData.affix, this.baddieData.affix.target);
          $(`#affixModal-${this.label}`).modal('hide');
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .baddie-list {
    img {
      width: 30px;
    }
  }
  .remove-affix {
    position: absolute;
    top: -5px;
    right: 3px;
    cursor: pointer;

    &:hover {
      transform: scale(1.5);
      color: red;
    };
  }
</style>