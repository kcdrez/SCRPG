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
      <div class="col-6 mb-3" v-for="(villain, villainIndex) in list">
        <div class="card">
          <div class="card-header">
            <h3 class="d-inline"><a :href="`#villain-${villain.name}`" data-toggle="collapse">{{villain.name}}</a></h3>
            <div class="btn-group btn-group-sm float-right w-25">
              <button class="btn btn-danger border-dark" 
                @click="$store.commit('DELETE_BADDIE', {baddieIndex: villainIndex, type: 'villains'})">Remove</button>
            </div>
          </div>
          <div :id="`villain-${villain.name}`" class="card-body collapse show">
            <div class="text-center">
              <div class="btn-group btn-group-sm w-50">
                <button class="btn btn-success border-dark" @click="affectVillain(villain, true)">Boost</button>
                <button class="btn btn-warning border-dark" @click="affectVillain(villain, false)">Hinder</button>
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
                  <tr v-for="(bonus, affixIndex) in villain.bonuses">
                    <td class="text-center">{{bonus.name}}</td>
                    <td class="text-center">+{{bonus.amount}}</td>
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
                  <tr v-for="(penalty, affixIndex) in villain.penalties">
                    <td class="text-center">{{penalty.name}}</td>
                    <td class="text-center">{{penalty.amount}}</td>
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
              <input class="form-control" v-model.trim="name" type="text">
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
                @keydown.enter="affix.target.addAffix(affix)">
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
                @keydown.enter="affix.target.addAffix(affix)">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" 
              @click="affix.target.addAffix(affix)" data-dismiss="modal">Add</button>
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
        affix: {
          type: '',
          amount: 0,
          max: 0,
          min: 0,
          target: null
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
      affectVillain(villain, boosting) {
        this.affix.max = boosting ? 4: -1;
        this.affix.min = boosting ? 1: -4;
        this.affix.amount = boosting ? 1: -1;
        this.affix.type = boosting ? 'Bonus': 'Penalty';
        this.affix.target = villain;
        this.$store.dispatch('saveBaddies', 'villains');
        $(`#affixModal-villain`).modal('show');
      }
    }
  };
</script>

<style lang="scss" scoped>
  
</style>