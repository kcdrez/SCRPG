<template>
  <div class="scene-tracker-component">
    <div class="row scene-tracker-header">
      <div class="col">
        <h2><a href="#sceneTrackerData" data-toggle="collapse">Environment</a></h2>
      </div>
    </div>
    <div id="sceneTrackerData" class="collapse show">
      <div class="row">
        <div class="col-7 text-center scene-tracker">
          <h3>Scene Tracker</h3>
          <div class="btn-group btn-group-sm w-50">
            <button class="btn btn-sm btn-success border-dark" 
              data-toggle="modal" data-target="#sceneTrackerModal" title="Create a new Scene Tracker">Create Scene</button>
            <button class="btn btn-sm btn-warning border-dark" @click="clearScene" title="Clear the Scene Tracker">Clear Scene</button>
            <button class="btn btn-sm btn-danger border-dark" @click="resetScene" 
              title="Reset the Environment, removing the Scene Tracker and all Minions, Lieutenants, Villains, and Obstacles">Reset Scene</button>
          </div>
          <div v-if="noScenes">
            There is no Scene Tracker.
          </div>
          <div v-else>
            <h4>{{scene.name}}</h4>
            <div v-for="(item, index) in scene.green" class="d-inline" @click="progressScene(item)" :key="'green' + index">
              <img src="images/green_checked.png" v-if="item.checked">
              <img src="images/green.png" v-else>
            </div>
            <div v-for="(item, index) in scene.yellow" class="d-inline" @click="progressScene(item)"  :key="'yellow' + index">
              <img src="images/yellow_checked.png" v-if="item.checked">
              <img src="images/yellow.png" v-else>
            </div>
            <div v-for="(item, index) in scene.red" class="d-inline" @click="progressScene(item)"  :key="'red' + index">
              <img src="images/red_checked.png" v-if="item.checked">
              <img src="images/red.png" v-else>
            </div>
          </div>
          <div class="container p-0">
            <div class="row">
              <div class="col">
                <hr class="border-dark">
                <h3>Obstacles</h3>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-success border-dark" @click="addObstacleModal" title="Add a new Obstacle to the Scene">Add Obstacle</button>
                  <button class="btn btn-danger border-dark" title="Remove all Obstacles from the Scene" @click="scene.obstacles = []">Reset Obstacles</button>
                </div>
              </div>
            </div>
            <div class="row" v-for="(obstacle, obstacleIndex) in scene.obstacles" :key="obstacle.name">
              <div class="col-12 mb-1">
                <div class="text-left mb-1">
                  <h5 class="d-inline align-middle m-0">{{obstacle.name}}</h5>
                  <button class="btn btn-sm btn-danger border-dark mx-1" title="Remove this Obstacle from the Scene" 
                    @click="scene.obstacles.splice(obstacleIndex, 1)">Remove</button>
                </div>
                <div class="input-group input-group-sm mb-1 w-50">
                  <input type="text" class="form-control border-dark" placeholder="New Obstacle Element" v-model.trim="obstacle.newEntry">
                  <div class="input-group-append">
                    <button class="btn btn-success border-dark" type="button"  title="Add a new entry to this Obstacle" 
                      @click="addObstacle(obstacle)">Add Element</button>
                  </div>
                </div>
              </div>
              <div class="col-12" v-if="obstacle.list.length > 0">
                <table class="table table-sm table-stripped table-bordered table-dark">
                  <thead>
                    <tr>
                      <th width="20%">Completed?</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, itemIndex) in obstacle.list" :key="item.label">
                      <td @click="item.completed = !item.completed" class="h4">
                        <i class="fa fa-check c-pointer text-success" v-if="item.completed"></i>
                        <i class="fa fa-times c-pointer text-danger" v-else></i>
                      </td>
                      <td>
                        <input type="text" v-model.trim="item.tempLabel" v-if="item.editing" class="form-control form-control-sm">
                        <template v-else>{{item.label}}</template>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-primary border-dark" @click="item.editing = true" v-if="!item.editing">Edit</button>
                          <template v-else>
                            <button class="btn btn-success border-dark" @click="item.editing = false; item.label = item.tempLabel">Save</button>
                            <button class="btn btn-secondary border-dark" @click="item.editing = false">Cancel</button>
                          </template>
                          <button class="btn btn-danger border-dark" @click="obstacle.list.splice(itemIndex, 1)">Remove</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-5 round-tracker">
          <h4 class="text-center">Round Tracker</h4>
          <div class="text-center mb-3">
            <div class="btn-group btn-group-sm w-75 mx-auto">
              <button class="btn btn-success border-dark" data-toggle="modal" data-target="#addPlayerModal" title="Add a new player to the scene">Add Player</button>
              <button class="btn btn-warning border-dark" title="Clear all players from the scene" @click="clearPlayers">Clear Players</button>
              <button class="btn btn-danger border-dark" @click="resetRound" title="Reset the round, marking all actors to not having acted yet">Reset Round Tracker</button>
            </div>
          </div>
          <table class="table table-sm table-bordered table-dark table-stripped" v-if="actorsCount > 0">
            <thead class="text-center">
              <tr>
                <th width="40%">Actor Name</th>
                <th width="30%">Actor Type</th>
                <th width="30%">Actions</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr v-if="scene.name !== ''">
                <td class="text-capitalize" @click="actorActed(scene)">
                  <i class="fa fa-check text-success" v-if="scene.acted"></i>
                  {{scene.name}}
                </td>
                <td class="text-capitalize" @click="actorActed(scene)">Environment</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-primary border-dark" @click="actorActed(scene)" title="Toggle the Environment to have acted already in the current round">Acted</button>
                  </div>
                </td>
              </tr>
              <tr v-for="player in players" :key="'roundTracker-player' + player.name">
                <td class="text-capitalize" @click="actorActed(player)">
                  <i class="fa fa-check text-success" v-if="player.acted"></i>
                  {{player.name}}
                </td>
                <td class="text-capitalize" @click="actorActed(player)">Player</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-primary border-dark" @click="actorActed(player)" title="Toggle this Player to have acted already in the current round">Acted</button>
                    <button class="btn btn-secondary border-dark" @click="renamePlayerModal(player)" title="Rename this Player">Rename</button>
                    <button class="btn btn-danger border-dark" @click="removePlayer(player.name)" title="Remove this Player from the scene">Remove</button>
                  </div>
                </td>
              </tr>
              <tr v-for="villain in villains" :key="'roundTracker-villain' + villain.name">
                <td class="text-capitalize" @click="actorActed(villain)">
                  <i class="fa fa-check text-success" v-if="villain.acted"></i>
                  {{villain.name}}
                </td>
                <td class="text-capitalize" @click="actorActed(villain)">Villain</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-primary border-dark" @click="actorActed(villain)" title="Toggle this Villain to have acted already in the current round">Acted</button>
                  </div>
                </td>
              </tr>
              <template v-for="lieutenant in lieutenants">
                <tr v-for="(item, index) in lieutenant.list" :key="'roundTracker-lieutenant' + lieutenant.name + index">
                  <td class="text-capitalize" @click="actorActed(lieutenant, index)">
                    <i class="fa fa-check text-success" v-if="item.acted"></i>
                    {{lieutenant.name}}
                    <img :src="`images/d${item.size}.png`" :title="`This minion uses a d${item.size}`">
                  </td>
                  <td class="text-capitalize" @click="actorActed(lieutenant, index)">Lieutenant</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-primary border-dark" @click="actorActed(lieutenant, index)" 
                        title="Toggle this Lieutenant to have acted already in the current round">Acted</button>
                    </div>
                  </td>
                </tr>
              </template>
              <template v-for="minion in minions">
                <tr v-for="(item, index) in minion.list" :key="'roundTracker-minion' + minion.name + index">
                  <td class="text-capitalize" @click="actorActed(minion, index)">
                    <i class="fa fa-check text-success" v-if="item.acted"></i>
                    {{minion.name}} 
                    <img :src="`images/d${item.size}.png`" :title="`This minion uses a d${item.size}`">
                  </td>
                  <td class="text-capitalize" @click="actorActed(minion, index)">Minion</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-primary border-dark" @click="actorActed(minion, index)" 
                        title="Toggle this Minion to have acted already in the current round">Acted</button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
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
                <div class="input-group-text">Name</div>
              </div>
              <input class="form-control" v-model.trim="scene.text" type="text" ref="scene" @keypress.enter="createScene">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Green</div>
              </div>
              <input class="form-control" v-model.number="green" type="number" ref="green" @keypress.enter="createScene">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Yellow</div>
              </div>
              <input class="form-control" v-model.number="yellow" type="number" ref="yellow" @keypress.enter="createScene">
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">Red</div>
              </div>
              <input class="form-control" v-model.number="red" type="number" ref="red" @keypress.enter="createScene">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="createScene" :disabled="scene.text === ''">Create</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="addPlayerModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a Player</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Add a player to the Scene.
            <input type="text" v-model.trim="newPlayerName" class="form-control form-control-sm" @keypress.enter="addPlayer" ref="newPlayerName">
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="addPlayer" :disabled="newPlayerName === ''">Create</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="renamePlayerModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Rename a Player</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Rename the player ({{renamePlayerData.target.name || '---'}})
            <input type="text" v-model.trim="renamePlayerData.text" class="form-control form-control-sm" @keypress.enter="renamePlayer" ref="renamePlayer">
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="renamePlayer" :disabled="renamePlayerData.text === ''">Rename</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="obstacleModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add an Obstacle</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">Name</span>
              </div>
              <input type="text" v-model.trim="obstacle.name" class="form-control" placeholder="Obstacle Name" @keypress.enter="addObstacle()" ref="obstacleName">
            </div>
            <div>
              <h6>Add some obstacles (optional)</h6>
              <div class="input-group input-group-sm mb-3">
                <input type="text" class="form-control border-dark" placeholder="Obstacle Description" v-model.trim="obstacle.description" @keydown.enter="addTempObstacle">
                <div class="input-group-append">
                  <button class="btn btn-primary border-dark" type="button" @click="addTempObstacle" :disabled="obstacle.description === ''">Add</button>
                </div>
              </div>
              <div class="input-group input-group-sm mb-1" v-for="(item, index) in obstacle.list" :key="'obstacle' + index">
                <input type="text" class="form-control border-dark" placeholder="Obstacle Description" v-model.trim="item.label">
                <div class="input-group-append">
                  <button class="btn btn-danger border-dark" type="button" @click="obstacle.list.splice(index, 1)">Remove</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" type="button" data-dismiss="modal" @click="addObstacle()" :disabled="obstacle.name === ''">Save</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import {Baddie, Villain} from '../scripts/baddie.js';
  import {unvue} from '../scripts/utilities.js';
  import {mapState} from 'vuex';
  import {diff} from 'deep-diff';

  export default {
    name: 'SceneTracker',
    data() {
      return {
        green: 2,
        yellow: 4,
        red: 2,
        scene: {
          green: [],
          yellow: [],
          red: [],
          name: '',
          text: '',
          acted: false,
          obstacles: []
        },
        players: [],
        newPlayerName: '',
        renamePlayerData: {
          target: {
            name: ''
          },
          text: ''
        },
        obstacle: {
          name: '',
          description: '',
          list: []
        }
      }
    },
    methods: {
      createScene() {
        if (this.scene.text !== '') {
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
          this.scene.name = this.scene.text;
          $('#sceneTrackerModal').modal('hide');
        }
      },
      progressScene(item) {
        item.checked = !item.checked;
      },
      clearScene() {
        this.scene.green = [];
        this.scene.yellow = [];
        this.scene.red = [];
        this.scene.acted = false;
        this.scene.name = '';
      },
      resetScene() {
        this.$dialog.confirm({
          title: 'Are You Sure?',
          body: 'Are you sure you want to reset the Scene? All Minions, Lieutenants, Villans, Obstacles and the Scene Tracker will be removed.'
        }, {
          okText: 'Yes',
          cancelText: 'No'
        })
        .then(r => {
          this.scene.obstacles = [];
          this.clearScene();
          this.$store.commit('RESET_SCENE');
        });
      },
      addPlayer() {
        if (this.newPlayerName !== '') {
          this.players.push({name: this.newPlayerName, acted: false, type: 'player'});
          $('#addPlayerModal').modal('hide');
        }
      },
      removePlayer(playerName) {
        const index = this.players.findIndex(x => x.name === playerName);
        if (index > -1) {
          this.players.splice(index, 1);
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
          this.players = [];
        });
      },
      renamePlayerModal(player) {
        if (player) {
          this.renamePlayerData.target = player;
          this.renamePlayerData.text = player.name;
          $("#renamePlayerModal").modal('show');
        }
      },
      renamePlayer() {
        if (this.renamePlayerData.text !== '') {
          this.renamePlayerData.target.name = this.renamePlayerData.text;
        }
      },
      actorActed(actor, index) {
        if (actor instanceof Baddie || actor instanceof Villain) {
          actor.takenAction(index);
        } else {
          actor.acted = !actor.acted;
        }
      },
      resetRound() {
        this.players.forEach(x => x.acted = false);
        this.villains.forEach(x => x.acted = false);
        this.lieutenants.forEach(x => x.resetRound());
        this.minions.forEach(x => x.resetRound() );
        this.scene.acted = false;
      },
      addObstacleModal() {
        $("#obstacleModal").modal('show');
        this.$refs.obstacleName.focus();
      },
      addObstacle(obstacle) {
        if (obstacle) {
          obstacle.list.push({
            label: obstacle.newEntry,
            tempLabel: obstacle.newEntry,
            completed: false,
            editing: false
          });
          obstacle.newEntry = '';
        } else if (this.obstacle.name !== '') {
          this.scene.obstacles.push({
            name: this.obstacle.name,
            newEntry: '',
            list: unvue(this.obstacle.list)
          });
          this.obstacle.name = '';
          this.obstacle.list = [];
          this.obstacle.description = '';
          $("#obstacleModal").modal('hide');
        }
      },
      addTempObstacle() {
        if (this.obstacle.description !== '') {
          this.obstacle.list.push({
            label: this.obstacle.description,
            tempLabel: this.obstacle.description,
            completed: false,
            editing: false
          });
          this.obstacle.description = '';
        }
      }
    },
    computed: {
      noScenes() {
        return this.scene.green.length === 0 &&
          this.scene.yellow.length === 0 &&
          this.scene.red.length === 0;
      },
      ...mapState([
        'minions',
        'lieutenants',
        'villains'
      ]),
      actorsCount() {
        let count = 0;
        count += this.players.length;
        count += this.minions.length;
        count += this.lieutenants.length;
        count += this.villains.length;
        return count;
      }
    },
    created() {
      const sceneData = Cookies.getJSON('sceneTracker');
      if (sceneData) {
        this.scene.green = sceneData.green || [];
        this.scene.yellow = sceneData.yellow || [];
        this.scene.red = sceneData.red || [];
        this.scene.obstacles = sceneData.obstacles || [];
        this.scene.name = sceneData.name || '';
        this.scene.text = sceneData.text || '';
        this.scene.acted = sceneData.acted || false;
      }

      const playerData = Cookies.getJSON('players');
      if (playerData) {
        this.players = playerData;
      }
    },
    mounted() {
      $('#sceneTrackerModal').on('shown.bs.modal', e => {
        this.$refs.scene.focus();
      });
      $('#addPlayerModal').on('shown.bs.modal', e => {
        this.$refs.newPlayerName.focus();
      });
      $('#addPlayerModal').on('shown.bs.modal', e => {
        this.$refs.renamePlayer.focus();
      });
    },
    watch: {
      scene: {
        deep: true,
        handler(newVal) {
          Cookies.set('sceneTracker', newVal);
        }
      },
      players: {
        deep: true,
        handler(newVal) {
          Cookies.set('players', newVal);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .scene-tracker {
    img {
      cursor: pointer;

      &:hover {
        transform: translate(0px, -3px);
      }
    }
  }

  .round-tracker {
    img {
      max-width: 20px;
      margin: 0 .25rem;
    }
  }
</style>