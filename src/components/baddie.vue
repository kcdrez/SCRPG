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
      <div class="col-6 mb-3" v-for="(baddie, baddieIndex) in list">
        <div class="card">
          <div class="card-header">
            <h3 class="d-inline"><a :href="`#${label}-${baddie.name}`" data-toggle="collapse">{{baddie.name}}</a></h3>
            <div class="btn-group btn-group-sm float-right w-25">
              <button class="btn btn-success border-dark" @click="addBaddie(baddie.name)">Add</button>
              <button class="btn btn-danger border-dark" 
                @click="$store.commit('DELETE_BADDIE', {baddieIndex, type: label.toLowerCase()})">Remove</button>
            </div>
          </div>
          <div :id="`${label}-${baddie.name}`" class="card-body collapse show">
            <template v-for="(data, size) in baddie.types">
              <template v-if="data.length > 0">
                <h4>
                  <a :href="`#${label}-${baddie.name}-${size}`" data-toggle="collapse"><b>Size:</b></a>
                  <img :src="`images/d${size}.png`" :title="`This minion uses a d${size}`">
                  <div class="d-inline" :title="`There are ${baddie.countBySize(size)} minions that use this die size`">
                    ({{baddie.countBySize(size)}})
                  </div>
                </h4>
                <table :id="`${label}-${baddie.name}-${size}`" 
                  class="collapse table table-sm table-striped table-bordered">
                  <thead class="text-center">
                    <tr>
                      <th width="15%">Count</th>
                      <th width="25%">Boosts</th>
                      <th width="25%">Hinders</th>
                      <th width="35%">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(el, index) in data">
                      <td class="text-center align-middle">{{el.count}}</td>
                      <td class="text-center">
                        <template v-if="el.boosts.length === 0">-</template>
                        <div class="border border-dark position-relative" v-for="(boost, affixIndex) in el.boosts">
                          <div class="remove-affix" @click="$store.dispatch('removeAffix', {baddieType: label.toLowerCase(), baddie, size, baddieIndex: index, affixIndex, type: 'boosts'})">&times;</div>
                          <div><b>Name: </b>{{boost.name}}</div>
                          <div><b>Amount: </b>{{boost.amount}}</div>
                        </div>
                      </td>
                      <td class="text-center">
                        <template v-if="el.hinders.length === 0">-</template>
                        <div class="border border-dark position-relative" v-for="(hinder, affixIndex) in el.hinders">
                          <div class="remove-affix" @click="$store.dispatch('removeAffix', {baddieType: label.toLowerCase(), baddie, size, baddieIndex: index, affixIndex, type: 'hinders'})">&times;</div>
                          <div><b>Name: </b>{{hinder.name}}</div>
                          <div><b>Amount: </b>{{hinder.amount}}</div>
                        </div>
                      </td>
                      <td class="align-middle">
                        <div class="btn-group btn-group-sm w-100 mb-2" role="group">
                          <button class="btn btn-success border-dark" 
                            @click="affectBaddie(size, baddieIndex, true, baddie)">Boost</button>
                          <button class="btn btn-warning border-dark" 
                            @click="affectBaddie(size, baddieIndex, false, baddie)">Hinder</button>
                        </div>
                        <div class="btn-group btn-group-sm w-100">
                          <button class="btn btn-info border-dark" 
                            @click="demoteBaddie(baddie, size, index)">Demote</button>
                          <button class="btn btn-danger border-dark" 
                            @click="removeBaddie(baddie, size, index)">Remove</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </template>
          </div>
        </div>
      </div>
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
              <input class="form-control" v-model.trim="baddieData.name" type="text">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Size</div>
              </div>
              <input class="form-control" 
                v-model.number="baddieData.size" type="number" step="2" min="4" max="12">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Count</div>
              </div>
              <input class="form-control" v-model.number="baddieData.count" type="number" min="1">
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
                @keydown.enter="$store.dispatch('addBaddieAffix', {baddieType: label, affixData: baddieData.affix})">
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
                @keydown.enter="$store.dispatch('addBaddieAffix', {baddieType: label, affixData: baddieData.affix})">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" 
              @click="$store.dispatch('addBaddieAffix', {baddieType: label, affixData: baddieData.affix})" data-dismiss="modal">Add</button>
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
          count: 5,
          affix: {
            amount: 0,
            name: '',
            max: 0,
            min: 0,
            type: '',
            size: 0,
            index: -1,
            target: null
          }
        }
      }
    },
    methods: {
      createBaddie() {
        const {name, size, count} = this.baddieData;
        this.$store.commit('UPSERT_BADDIE', {baddie: new Baddie(name, size, count), baddieType: this.label.toLowerCase()});
      },
      addBaddie(name) {
        this.baddieData.name = name;
        $('#createModal-' + this.label).modal('show');
      },
      affectBaddie(size, index, boosting, baddie) {
        this.baddieData.affix.max = boosting ? 4: -1;
        this.baddieData.affix.min = boosting ? 1: -4;
        this.baddieData.affix.amount = boosting ? 1: -1;
        this.baddieData.affix.type = boosting ? 'Boost': 'Hinder';
        this.baddieData.affix.size = size;
        this.baddieData.affix.index = index;
        this.baddieData.affix.target = baddie;
        this.$store.dispatch('saveBaddies', this.label);
        $(`#affixModal-${this.label}`).modal('show');
      },
      demoteBaddie(baddie, size, index) {
        baddie.demote(size, index);
        this.$store.dispatch('saveBaddies', this.label.toLowerCase());
      },
      removeBaddie(baddie, size, index) {
        baddie.remove(size, index);
        ctx.dispatch('saveBaddies', this.label.toLowerCase());
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