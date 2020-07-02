<template>
  <div class="container">
    <div class="row">
      <h1 class="col text-center">
        GM Management
      </h1>
    </div>
    <div class="row mb-3">
      <div class="col-4">
        <h3>Create Scene Tracker</h3>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <div class="input-group-text">Green</div>
          </div>
          <input class="form-control" v-model.number="green" type="number">
        </div>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <div class="input-group-text">Yellow</div>
          </div>
          <input class="form-control" v-model.number="yellow" type="number">
        </div>
        <div class="input-group input-group-sm">
          <div class="input-group-prepend">
            <div class="input-group-text">Red</div>
          </div>
          <input class="form-control" v-model.number="red" type="number">
        </div>
      </div>
      <div class="col m-auto text-center">
        <button class="btn btn-primary" @click="createScene">Create Scene Tracker</button>
        <button class="btn btn-warning" @click="clearScene">Clear Scene Tracker</button>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <h3>Create Minion</h3>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <div class="input-group-text">Name</div>
          </div>
          <input class="form-control" v-model.trim="$store.state.minionData.name" type="text">
        </div>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <div class="input-group-text">Size</div>
          </div>
          <input class="form-control" v-model.number="$store.state.minionData.size" type="number" step="2" min="4" max="12">
        </div>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <div class="input-group-text">Count</div>
          </div>
          <input class="form-control" v-model.number="$store.state.minionData.count" type="number" min="0">
        </div>
      </div>
      <div class="col text-center m-auto">
        <button class="btn btn-primary" @click="createMinion">Create Minion</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h3>Scene Tracker</h3>
        <div v-for="item in scene.green" class="d-inline" @click="progressScene(item)">
          <img src="/src/assets/images/green_checked.png" v-if="item.checked">
          <img src="/src/assets/images/green.png" v-else>
        </div>
        <div v-for="item in scene.yellow" class="d-inline" @click="progressScene(item)">
          <img src="/src/assets/images/yellow_checked.png" v-if="item.checked">
          <img src="/src/assets/images/yellow.png" v-else>
        </div>
        <div v-for="item in scene.red" class="d-inline" @click="progressScene(item)">
          <img src="/src/assets/images/red_checked.png" v-if="item.checked">
          <img src="/src/assets/images/red.png" v-else>
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12">
        <h3>Minions</h3>
      </div>
      <div class="col-12 mb-3" v-for="(minion, minionIndex) in $store.state.minions">
        <div class="card">
          <div class="card-header">
            <h3 class="d-inline">{{minion.name}}</h3>
            <button class="btn btn-danger btn-sm float-right" @click="$store.commit('DELETE_MINION', minionIndex)">Remove</button>
          </div>
          <div class="card-body">
            <template v-for="(data, size) in minion.types">
              <template v-if="data.length > 0">
                <h4><b>Size:</b> d{{size}}</h4>
                <table class="table table-sm table-striped table-bordered">
                  <thead class="text-center">
                    <tr>
                      <th>Count</th>
                      <th>Boosts</th>
                      <th>Hinders</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(el, index) in data">
                      <td class="text-center align-middle">{{el.count}}</td>
                      <td class="text-center">
                        <template v-if="el.boosts.length === 0">-</template>
                        <div class="border border-dark position-relative" v-for="(boost, boostIndex) in el.boosts">
                          <div class="remove-affix" @click="$store.dispatch('removeAffix', {minion: el, index: boostIndex, type: 'boosts'})">&times;</div>
                          <div><b>Name: </b>{{boost.name}}</div>
                          <div><b>Amount: </b>{{boost.amount}}</div>
                        </div>
                      </td>
                      <td class="text-center">
                        <template v-if="el.hinders.length === 0">-</template>
                        <div class="border border-dark position-relative" v-for="(hinder, hinderIndex) in el.hinders">
                          <div class="remove-affix" @click="$store.dispatch('removeAffix', {minion: el, index: hinderIndex, type: 'hinders'})">&times;</div>
                          <div><b>Name: </b>{{hinder.name}}</div>
                          <div><b>Amount: </b>{{hinder.amount}}</div>
                        </div>
                      </td>
                      <td class="align-middle">
                        <div>
                          <button class="btn btn-success btn-sm" @click="$store.dispatch('boostMinion', {minion, size, index})">Boost</button>
                          <button class="btn btn-warning btn-sm" @click="$store.dispatch('hinderMinion', {minion, size, index})">Hinder</button>
                          <button class="btn btn-danger btn-sm" @click="$store.dispatch('demoteMinion', {minion, size, index})">Demote</button>
                          <button class="btn btn-danger btn-sm" @click="$store.dispatch('removeMinion', {minion, size, index})">Remove</button>
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
    <div id="affixMinionModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a {{$store.state.minionData.affix.type}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Name</div>
              </div>
              <input class="form-control" v-model.trim="$store.state.minionData.affix.name" type="text" @keydown.enter="$store.dispatch('addMinionAffix')">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Name</div>
              </div>
              <input class="form-control" 
                v-model.number="$store.state.minionData.affix.amount" 
                type="number" 
                :max="$store.state.minionData.affix.max"
                :min="$store.state.minionData.affix.min"
                @keydown.enter="$store.dispatch('addMinionAffix')">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="$store.dispatch('addMinionAffix')" data-dismiss="modal">Add</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import Minion from '../scripts/minions';

  export default {
    name: 'AdminPage',
    data() {
      return {
        green: 1,
        yellow: 0,
        red: 0,
        scene: {
          green: [],
          yellow: [],
          red: []
        }
      }
    },
    methods: {
      createScene() {
        this.clearScene();

        for (let i = 0; i < this.green; i++) {
          this.scene.green.push({checked: false});
        }
        for (let i = 0; i < this.yellow; i++) {
          this.scene.yellow.push({checked: false});
        }
        for (let i = 0; i < this.red; i++) {
          this.scene.red.push({checked: false});
        }
        Cookies.set('sceneTracker', this.scene);
      },
      progressScene(item) {
        item.checked = !item.checked;
        Cookies.set('sceneTracker', this.scene);
      },
      clearScene() {
        this.scene.green = [];
        this.scene.yellow = [];
        this.scene.red = [];
        Cookies.set('sceneTracker', this.scene);
      },
      createMinion() {
        const {name, size, count} = this.$store.state.minionData;
        this.$store.commit('ADD_MINION', new Minion(name, size, count));
      }
    },
    created() {
      const sceneData = Cookies.getJSON('sceneTracker');
      if (sceneData) {
        this.scene.green = sceneData.green;
        this.scene.yellow = sceneData.yellow;
        this.scene.red = sceneData.red;
      }
    }
  };
</script>

<style lang="scss">
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