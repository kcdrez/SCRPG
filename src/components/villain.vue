<template>
  <div class="villain-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h2>
          <a href="#villain-Data" 
             data-toggle="collapse">Villains</a>
        </h2>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-sm btn-success border-dark" 
                  data-toggle="modal" 
                  data-target="#createModal-villain">Create</button>
        </div>
      </div>
    </div>
    <div id="villain-Data" 
         class="collapse show row">
      <div class="col" 
           v-if="villains.length === 0">
        There are no Villains.
      </div>
      <div class="col-6 mb-3" 
           v-for="(villain, villainIndex) in villains" 
           :key="villain.id">
        <div class="card">
          <div class="card-header">
            <h3 class="d-inline">
              <a :href="`#villain-${villain.id}`" 
                 data-toggle="collapse">{{villain.name}}</a>
            </h3>
            <div class="btn-group btn-group-sm float-right w-25">
              <button class="btn btn-danger border-dark" 
                      @click="$store.commit('DELETE_BADDIE', {index: villainIndex, baddieType: 'villains'})">Remove</button>
            </div>
          </div>
          <div :id="`villain-${villain.id}`" 
               class="card-body collapse show">
            <div class="text-center">
              <div class="btn-group btn-group-sm w-50">
                <button class="btn btn-success border-dark" 
                        @click="modifyVillain(villain, 'boost')">Boost</button>
                <button class="btn btn-warning border-dark" 
                        @click="modifyVillain(villain, 'hinder')">Hinder</button>
                <button class="btn btn-secondary border-dark" 
                        @click="modifyVillain(villain, 'defend')">Defend</button>
                <button class="btn btn-secondary border-dark" 
                        @click="$emit('add-minion', villain.id)">Add Minion</button>
              </div>
            </div>
            <template v-if="villain.bonuses.length > 0">
              <h3>Bonuses</h3>
              <table class="table table-sm table-striped table-bordered">
                <thead class="text-center">
                  <tr>
                    <th width="25%">Name</th>
                    <th width="25%">Amount</th>
                    <th width="35%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(bonus, modIndex) in villain.bonuses" :key="villain.id + 'bonus' + modIndex">
                    <td class="text-center">{{bonus.name}}</td>
                    <td class="text-center">
                      +{{bonus.amount}}
                      <div v-if="bonus.persistent" 
                           class="font-italic">Persistent</div>
                      <div v-if="bonus.exclusive" 
                           class="font-italic">Exclusive</div>
                    </td>
                    <td class="align-middle">
                      <div class="btn-group btn-group-sm w-100">
                        <button class="btn btn-danger border-dark" 
                                @click="villain.removeModifier('bonuses', modIndex)">Remove</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
            <template v-if="villain.penalties.length > 0">
              <h3>Penalties</h3>
              <table class="table table-sm table-striped table-bordered">
                <thead class="text-center">
                  <tr>
                    <th width="25%">Name</th>
                    <th width="25%">Amount</th>
                    <th width="35%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(penalty, modIndex) in villain.penalties" 
                     :key="villain.id + 'penalties' + modIndex">
                    <td class="text-center">{{penalty.name}}</td>
                    <td class="text-center">
                      {{penalty.amount}}
                      <div v-if="penalty.persistent" 
                           class="font-italic">Persistent</div>
                      <div v-if="penalty.exclusive" 
                           class="font-italic">Exclusive</div>
                    </td>
                    <td class="align-middle">
                      <div class="btn-group btn-group-sm w-100">
                        <button class="btn btn-danger border-dark" 
                                @click="villain.removeModifier('penalties', modIndex)">Remove</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
            <template v-if="villain.defends.length > 0">
              <h3>Defends</h3>
              <table class="table table-sm table-striped table-bordered">
                <thead class="text-center">
                  <tr>
                    <th width="25%">Name</th>
                    <th width="25%">Amount</th>
                    <th width="35%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(defend, modIndex) in villain.defends" :key="villain.id + 'defends' + modIndex">
                    <td class="text-center">{{defend.name}}</td>
                    <td class="text-center">
                      {{defend.amount}}
                    </td>
                    <td class="align-middle">
                      <div class="btn-group btn-group-sm w-100">
                        <button class="btn btn-danger border-dark" 
                          @click="villain.removeModifier('defends', modIndex)">Remove</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>            
          </div>
        </div>
      </div>
    </div>
    <div id="createModal-villain" 
         class="modal" 
         tabindex="-1" 
         role="dialog">
      <div class="modal-dialog" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create a Villain</h5>
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
                     v-model.trim="name" 
                     type="text"
                @keydown.enter="createVillain">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" 
                    type="button" 
                    data-dismiss="modal" 
                    @click="createVillain">Create</button>
            <button class="btn btn-secondary" 
                    type="button" 
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="modifierModal-villain" 
         class="modal" 
         tabindex="-1" 
         role="dialog">
      <div class="modal-dialog" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a {{modifier.type}}</h5>
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
              <input class="form-control" type="text"
                     v-model.trim="modifier.name"
                     @keydown.enter="target.addModifier(modifier)">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Amount</div>
              </div>
              <input class="form-control" 
                     v-model.number="modifier.amount" 
                     type="number" 
                     :max="modifier.max"
                     :min="modifier.min"
                     @keydown.enter="target.addModifier(modifier)">
            </div>
            <div class="d-inline" 
                 v-if="modifier.type !== 'Defend'">
              <label>Persistent?</label>
              <input type="checkbox" 
                     v-model="modifier.persistent">
            </div>
            <div class="d-inline mx-3" 
                 v-if="modifier.type !== 'Defend'">
              <label>Exclusive?</label>
              <input type="checkbox" 
                     v-model="modifier.exclusive">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" 
                    class="btn btn-primary" 
                    @click="target.addModifier(modifier)" 
                    data-dismiss="modal">Add</button>
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
  import {Villain} from '../scripts/baddie';
  import {mapState} from 'vuex';

  export default {
    name: 'Villains',
    data() {
      return {
        name: '',
        target: null,
        modifier: {
          type: '',
          amount: 0,
          max: 0,
          min: 0,
          persistent: false,
          exclusive: false
        }
      }
    },
    computed: {
      ...mapState([
        'villains'
      ])
    },
    methods: {
      createVillain() {
        if (this.name !== '') {
          this.$store.commit('UPSERT_BADDIE', {baddie: new Villain({name: this.name}), baddieType: 'villains'});
        }
      },
      modifyVillain(villain, type) {
        if (type === 'defend') {
          this.modifier.type = 'Defend';
          this.modifier.max = 100;
          this.modifier.min = 1;
          this.modifier.amount = 1;
        } else if (type ==='boost') {
          this.modifier.max = 4;
          this.modifier.min = 1;
          this.modifier.amount = 1;
          this.modifier.type = 'Bonus';
        } else if (type === 'hinder') {
          this.modifier.max = -1;
          this.modifier.min = -4;
          this.modifier.amount = -1;
          this.modifier.type = 'Penalty';
        } else {
          return;
        }
        this.target = villain;
        villain.refresh();
        $(`#modifierModal-villain`).modal('show');
      },
      addMinion() {

      }
    }
  };
</script>

<style lang="scss" scoped>
  
</style>