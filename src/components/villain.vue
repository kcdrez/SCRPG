<template>
  <div class="villain-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h3><a href="#villain-Data" data-toggle="collapse">Villains</a></h3>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-sm btn-success border-dark" 
            data-toggle="modal" data-target="#createModal-villain">Create</button>
        </div>
      </div>
    </div>
    <div id="villain-Data" class="collapse show row">
      <div class="col" v-if="list.length === 0">
        There are no Villains.
      </div>
      <div class="col-6 mb-3" v-for="(villain, villainIndex) in list" :key="villainIndex">
        <div class="card">
          <div class="card-header">
            <h3 class="d-inline">
              <a :href="`#villain-${villain.name.replace(/\s/g, '')}`" data-toggle="collapse">{{villain.name}}</a>
            </h3>
            <div class="btn-group btn-group-sm float-right w-25">
              <button class="btn btn-danger border-dark" 
                @click="$store.commit('DELETE_BADDIE', {baddieIndex: villainIndex, type: 'villains'})">Remove</button>
            </div>
          </div>
          <div :id="`villain-${villain.name.replace(/\s/g, '')}`" class="card-body collapse show">
            <div class="text-center">
              <div class="btn-group btn-group-sm w-50">
                <button class="btn btn-success border-dark" @click="affectVillain(villain, 'boost')">Boost</button>
                <button class="btn btn-warning border-dark" @click="affectVillain(villain, 'hinder')">Hinder</button>
                <button class="btn btn-secondary border-dark" @click="affectVillain(villain, 'defend')">Defend</button>
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
                  <tr v-for="(bonus, affixIndex) in villain.bonuses" :key="affixIndex">
                    <td class="text-center">{{bonus.name}}</td>
                    <td class="text-center">
                      +{{bonus.amount}}
                      <div v-if="bonus.persistent" class="font-italic">Persistent</div>
                      <div v-if="bonus.exclusive" class="font-italic">Exclusive</div>
                    </td>
                    <td class="align-middle">
                      <div class="btn-group btn-group-sm w-100">
                        <button class="btn btn-danger border-dark" 
                          @click="villain.removeAffix('bonuses', affixIndex)">Remove</button>
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
                  <tr v-for="(penalty, affixIndex) in villain.penalties" :key="affixIndex">
                    <td class="text-center">{{penalty.name}}</td>
                    <td class="text-center">
                      {{penalty.amount}}
                      <div v-if="penalty.persistent" class="font-italic">Persistent</div>
                      <div v-if="penalty.exclusive" class="font-italic">Exclusive</div>
                    </td>
                    <td class="align-middle">
                      <div class="btn-group btn-group-sm w-100">
                        <button class="btn btn-danger border-dark" 
                          @click="villain.removeAffix('penalties', affixIndex)">Remove</button>
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
                  <tr v-for="(defend, affixIndex) in villain.defends" :key="affixIndex">
                    <td class="text-center">{{defend.name}}</td>
                    <td class="text-center">
                      {{defend.amount}}
                    </td>
                    <td class="align-middle">
                      <div class="btn-group btn-group-sm w-100">
                        <button class="btn btn-danger border-dark" 
                          @click="villain.removeAffix('defends', affixIndex)">Remove</button>
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
    <div id="createModal-villain" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create a Villain</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Name</div>
              </div>
              <input class="form-control" v-model.trim="name" type="text"
                @keydown.enter="createVillain">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="createVillain">Create</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="affixModal-villain" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a {{affix.type}}</h5>
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
                v-model.trim="affix.name"
                @keydown.enter="target.addAffix(affix)">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Amount</div>
              </div>
              <input class="form-control" 
                v-model.number="affix.amount" 
                type="number" 
                :max="affix.max"
                :min="affix.min"
                @keydown.enter="target.addAffix(affix)">
            </div>
            <div class="d-inline" v-if="affix.type !== 'Defend'">
              <label>Persistent?</label>
              <input type="checkbox" v-model="affix.persistent">
            </div>
            <div class="d-inline mx-3" v-if="affix.type !== 'Defend'">
              <label>Exclusive?</label>
              <input type="checkbox" v-model="affix.exclusive">
            </div>            
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" 
              @click="target.addAffix(affix)" data-dismiss="modal">Add</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Villain} from '../scripts/baddie';

  export default {
    name: 'Villains',
    data() {
      return {
        name: '',
        target: null,
        affix: {
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
      list() {
        return this.$store.state.villains;
      }
    },
    methods: {
      createVillain() {
        if (this.name !== '') {
          this.$store.commit('UPSERT_BADDIE', {baddie: new Villain(this.name), baddieType: 'villains'});
        }
      },
      affectVillain(villain, type) {
        if (type === 'defend') {
          this.affix.type = 'Defend';
          this.affix.max = 100;
          this.affix.min = 1;
          this.affix.amount = 1;
        } else if (type ==='boost') {
          this.affix.max = 4;
          this.affix.min = 1;
          this.affix.amount = 1;
          this.affix.type = 'Bonus';
        } else if (type === 'hinder') {
          this.affix.max = -1;
          this.affix.min = -4;
          this.affix.amount = -1;
          this.affix.type = 'Penalty';
        } else {
          return;
        }
        this.target = villain;
        villain.refresh();
        $(`#affixModal-villain`).modal('show');
      }
    }
  };
</script>

<style lang="scss" scoped>
  
</style>