<template>
  <div class="container admin-page">
    <div class="row">
      <h1 class="col text-center">GM Management</h1>
    </div>
    <div class="row scene-tracker-header">
      <div class="col">
        <h3><a href="#sceneTrackerData" data-toggle="collapse">Scene Tracker</a></h3>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-sm btn-success border-dark" 
            data-toggle="modal" data-target="#sceneTrackerModal">Create</button>
          <button class="btn btn-sm btn-warning border-dark" @click="clearScene">Clear</button>
        </div>
      </div>
    </div>
    <div id="sceneTrackerData" class="collapse row scene-tracker">
      <div class="col">
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
    <div class="row minion-list-header">
      <div class="col">
        <h3><a href="#minionData" data-toggle="collapse">Minions</a></h3>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-sm btn-success border-dark" 
            data-toggle="modal" data-target="#createMinionModal">Create</button>
        </div>
      </div>
    </div>
    <div id="minionData" class="collapse row minion-list">
      <div class="col-6 mb-3" v-for="(minion, minionIndex) in $store.state.minions">
        <div class="card">
          <div class="card-header">
            <h3 class="d-inline"><a :href="`#minion-${minion.name}`" data-toggle="collapse">{{minion.name}}</a></h3>
            <div class="btn-group btn-group-sm float-right w-25">
              <button class="btn btn-success border-dark" @click="addMinion(minion.name)">Add</button>
              <button class="btn btn-danger border-dark" 
                @click="$store.commit('DELETE_MINION', minionIndex)">Remove</button>
            </div>
          </div>
          <div :id="`minion-${minion.name}`" class="card-body collapse show">
            <template v-for="(data, size) in minion.types">
              <template v-if="data.length > 0">
                <h4>
                  <a :href="`#minion-${minion.name}-${size}`" data-toggle="collapse"><b>Size:</b></a>
                  <img :src="`/src/assets/images/d${size}.png`">
                  ({{minion.countBySize(size)}})
                </h4>
                <table :id="`minion-${minion.name}-${size}`" class="collapse table table-sm table-striped table-bordered">
                  <thead class="text-center">
                    <tr>
                      <th width="15%">Count</th>
                      <th width="25%">Boosts</th>
                      <th width="25%">Hinders</th>
                      <th width="35%">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(el, minionIndex) in data">
                      <td class="text-center align-middle">{{el.count}}</td>
                      <td class="text-center">
                        <template v-if="el.boosts.length === 0">-</template>
                        <div class="border border-dark position-relative" v-for="(boost, affixIndex) in el.boosts">
                          <div class="remove-affix" @click="$store.dispatch('removeAffix', {minion, size, minionIndex, affixIndex, type: 'boosts'})">&times;</div>
                          <div><b>Name: </b>{{boost.name}}</div>
                          <div><b>Amount: </b>{{boost.amount}}</div>
                        </div>
                      </td>
                      <td class="text-center">
                        <template v-if="el.hinders.length === 0">-</template>
                        <div class="border border-dark position-relative" v-for="(hinder, affixIndex) in el.hinders">
                          <div class="remove-affix" @click="$store.dispatch('removeAffix', {minion, size, minionIndex, affixIndex, type: 'hinders'})">&times;</div>
                          <div><b>Name: </b>{{hinder.name}}</div>
                          <div><b>Amount: </b>{{hinder.amount}}</div>
                        </div>
                      </td>
                      <td class="align-middle">
                        <div class="btn-group btn-group-sm w-100 mb-2" role="group">
                          <button class="btn btn-success border-dark" 
                            @click="$store.dispatch('boostMinion', {minion, size, index: minionIndex})">Boost</button>
                          <button class="btn btn-warning border-dark" 
                            @click="$store.dispatch('hinderMinion', {minion, size, index: minionIndex})">Hinder</button>
                        </div>
                        <div class="btn-group btn-group-sm w-100">
                          <button class="btn btn-info border-dark" 
                            @click="$store.dispatch('demoteMinion', {minion, size, index: minionIndex})">Demote</button>
                          <button class="btn btn-danger border-dark" 
                            @click="$store.dispatch('removeMinion', {minion, size, index: minionIndex})">Remove</button>
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
              <input class="form-control" type="text"
                v-model.trim="$store.state.minionData.affix.name"
                @keydown.enter="$store.dispatch('addMinionAffix')">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Amount</div>
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
            <button type="button" class="btn btn-primary" 
              @click="$store.dispatch('addMinionAffix')" data-dismiss="modal">Add</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="sceneTrackerModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Scene Tracker</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
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
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="createScene">Create</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>      
    </div>
    <div id="createMinionModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create a Minion</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
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
              <input class="form-control" 
                v-model.number="$store.state.minionData.size" type="number" step="2" min="4" max="12">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Count</div>
              </div>
              <input class="form-control" v-model.number="$store.state.minionData.count" type="number" min="1">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="createMinion">Create</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
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
        this.$store.commit('UPSERT_MINION', new Minion(name, size, count));
      },
      addMinion(name) {
        this.$store.state.minionData.name = name;
        $('#createMinionModal').modal('show');
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
  .admin-page {
    max-width: 90%;

    .row {
      margin-bottom: .5rem;
    }
  }

  .scene-tracker-header, .minion-list-header {
    margin-bottom: 1rem;

    .col {
      display: flex;
      margin-bottom: 0.5rem;
      
      h3 {
        margin: 0;
      }
      .btn-group {
        vertical-align: middle;
        margin: 0 1rem;
        width: 15%;
      }
    }
  }
  .scene-tracker {
    img {
      cursor: pointer;

      &:hover {
        transform: translate(0px, -3px);
      }
    }
  }
  .minion-list {
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