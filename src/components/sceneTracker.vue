<template>
  <div class="scene-tracker-component">
    <div class="row scene-tracker-header">
      <div class="col">
        <h2>
          <a href="#sceneTrackerData" 
             data-toggle="collapse">Environment</a>
        </h2>
      </div>
    </div>
    <div id="sceneTrackerData" class="collapse show">
      <div class="row">
        <div class="col-7 text-center scene-tracker">
          <h3>Scene Tracker</h3>
          <div class="btn-group btn-group-sm w-50">
            <button class="btn btn-sm btn-success border-dark" 
                    data-toggle="modal" 
                    data-target="#sceneTrackerModal" 
                    title="Create a new Scene Tracker">Create Scene</button>
            <button class="btn btn-sm btn-warning border-dark" 
                    @click="clearScene" 
                    title="Clear the Scene Tracker">Clear Scene</button>
            <button class="btn btn-sm btn-danger border-dark" 
                    @click="resetScene" 
                    title="Reset the Environment, removing the Scene Tracker and all Minions, Lieutenants, Villains, and Challenges">Reset Scene</button>
          </div>
          <div v-if="noScenes">
            There is no Scene Tracker.
          </div>
          <div v-else>
            <h4>{{scene.name}}</h4>
            <div v-for="(item, index) in scene.green" 
                 class="d-inline" 
                 @click="progressScene(item)" 
                 :key="'green' + index">
              <img src="images/green_checked.png" 
                   v-if="item.checked">
              <img src="images/green.png" 
                   v-else>
            </div>
            <div v-for="(item, index) in scene.yellow" 
                 class="d-inline" 
                 @click="progressScene(item)"
                 :key="'yellow' + index">
              <img src="images/yellow_checked.png" 
                   v-if="item.checked">
              <img src="images/yellow.png" 
                   v-else>
            </div>
            <div v-for="(item, index) in scene.red" 
                 class="d-inline" 
                 @click="progressScene(item)"
                 :key="'red' + index">
              <img src="images/red_checked.png" 
                   v-if="item.checked">
              <img src="images/red.png" 
                   v-else>
            </div>
          </div>
          <locations :locations="scene.locations"
                     @add="scene.locations.push($event)"
                     @remove="scene.locations.splice($event, 1)"
                     @reset="scene.locations = []" />
          <ChallengesTracker :challenges="scene.challenges" 
                             @reset="scene.challenges = []" 
                             @add="scene.challenges.push($event)"
                             @remove="scene.challenges.splice($event, 1)" />
        </div>
        <div class="col-5 round-tracker">
          <h4 class="text-center">Round Tracker</h4>
          <div class="text-center mb-3">
            <div class="btn-group btn-group-sm w-75 mx-auto">
              <button class="btn btn-success border-dark" 
                      data-toggle="modal" 
                      data-target="#addPlayerModal" 
                      title="Add a new player to the scene">Add Player</button>
              <button class="btn btn-warning border-dark" 
                      title="Clear all players from the scene" 
                      @click="clearPlayers">Clear Players</button>
              <button class="btn btn-danger border-dark" 
                      @click="resetRound" 
                      title="Reset the round, marking all actors to not having acted yet">Reset Round Tracker</button>
            </div>
          </div>
          <table class="table table-sm table-bordered table-dark table-stripped" v-if="actorsCount > 0">
            <thead class="text-center">
              <tr>
                <th width="35%">Actor Name</th>
                <th width="25%">Actor Type</th>
                <th width="20%">HP/Die Size</th>
                <th width="20%">Actions</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr v-if="scene.name !== ''">
                <td class="text-capitalize c-pointer" 
                    @click="actorActed(scene)"
                    title="Click to toggle the Environment to have acted already in the current round">
                  <i class="fa fa-check text-success" 
                     v-if="scene.acted"></i>
                    {{scene.name}}
                </td>
                <td class="text-capitalize c-pointer" 
                    @click="actorActed(scene)"
                    title="Click to toggle the Environment to have acted already in the current round">Environment</td>
                <td class="c-pointer"
                    @click="actorActed(villain)"
                    title="Click to toggle this Environment to have acted already in the current round"></td>
                <td class="c-pointer"
                    @click="actorActed(villain)"
                    title="Click to toggle this Environment to have acted already in the current round"></td>
              </tr>
              <tr v-for="player in players" 
                  :key="'roundTracker-player' + player.name">
                <td class="text-capitalize c-pointer" 
                    @click="actorActed(player)"
                    title="Click to toggle this Player to have acted already in the current round">
                  <i class="fa fa-check text-success" 
                     v-if="player.acted"></i>
                  {{player.name}}
                </td>
                <td class="text-capitalize c-pointer" 
                    @click="actorActed(player)"
                    title="Click to toggle this Player to have acted already in the current round">Player</td>
                <td class="c-pointer">
                    {{player.hp}}
                    <i class="fa fa-chevron-circle-up c-pointer" 
                       @click="player.hp++"
                       title="Increase Player HP"></i>
                    <i class="fa fa-chevron-circle-down c-pointer" 
                       @click="player.hp--"
                       title="Decrease Player HP"></i>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-secondary border-dark" 
                            @click="renamePlayerModal(player)" 
                            title="Edit this Player">
                      <i class="fa fa-pencil-square-o"></i>
                    </button>
                    <button class="btn btn-danger border-dark" 
                            @click="removePlayer(player.name)" 
                            title="Remove this Player from the scene">
                      <i class="fa fa-trash-o"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-for="villain in villains" 
                  :key="'roundTracker-villain' + villain.name">
                <td class="text-capitalize c-pointer" 
                    @click="actorActed(villain)"
                    title="Click to toggle this Villain to have acted already in the current round">
                  <i class="fa fa-check text-success" 
                     v-if="villain.acted"></i>
                    {{villain.name}}
                </td>
                <td class="text-capitalize c-pointer"
                    @click="actorActed(villain)"
                    title="Click to toggle this Villain to have acted already in the current round">Villain</td>
                <td class="c-pointer"
                    @click="actorActed(villain)"
                    title="Click to toggle this Villain to have acted already in the current round">-</td>
                <td class="c-pointer"
                    @click="actorActed(villain)"
                    title="Click to toggle this Villain to have acted already in the current round"></td>
              </tr>
              <template v-for="lieutenant in lieutenants">
                <tr v-for="(item, index) in lieutenant.list" 
                    :key="'roundTracker-lieutenant' + lieutenant.name + index">
                  <td class="text-capitalize c-pointer" 
                      @click="actorActed(lieutenant, index)"
                      title="Click to toggle this Lieutenant to have acted already in the current round">
                    <i class="fa fa-check text-success" v-if="item.acted"></i>
                    {{lieutenant.name}}
                  </td>
                  <td class="text-capitalize c-pointer" 
                      @click="actorActed(lieutenant, index)"
                      title="Click to toggle this Lieutenant to have acted already in the current round">Lieutenant</td>
                  <td class="c-pointer"
                      @click="actorActed(lieutenant, index)"
                      title="Click to toggle this Lieutenant to have acted already in the current round">
                    <img :src="`images/d${item.size}.png`" :title="`This minion uses a d${item.size}`">
                  </td>
                  <td class="c-pointer"
                      @click="actorActed(lieutenant, index)"
                      title="Click to toggle this Lieutenant to have acted already in the current round"></td>
                </tr>
              </template>
              <template v-for="minion in minions">
                <tr v-for="(item, index) in minion.list" 
                    :key="'roundTracker-minion' + minion.name + index">
                  <td class="text-capitalize c-pointer" 
                      @click="actorActed(minion, index)"
                      title="Click to toggle this Minion to have acted already in the current round">
                    <i class="fa fa-check text-success" 
                       v-if="item.acted"></i>
                    {{minion.name}} 
                  </td>
                  <td class="text-capitalize c-pointer" 
                      @click="actorActed(minion, index)"
                      title="Click to toggle this Minion to have acted already in the current round">Minion</td>
                  <td class="c-pointer" 
                      @click="actorActed(minion, index)"
                      title="Click to toggle this Minion to have acted already in the current round">
                    <img :src="`images/d${item.size}.png`" :title="`This minion uses a d${item.size}`">
                  </td>
                  <td class="c-pointer"
                      @click="actorActed(minion, index)"
                      title="Click to toggle this Minion to have acted already in the current round"></td>
                </tr>
              </template>
            </tbody>
          </table>
          <hr />
          <div>
            <h4>Notes</h4>
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link active" href="#viewNotes" data-toggle="tab" role="tab">View</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#editNotes" data-toggle="tab" role="tab">Edit</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#helpNotes" data-toggle="tab" role="tab">Help</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane fade show active" id="viewNotes" role="tabpanel" v-html="markdownNotes">
              </div>
              <div class="tab-pane fade" id="editNotes" role="tabpanel">
                <textarea class="form-control form-control-sm" v-model.trim="scene.notes"></textarea>
              </div>
              <div class="tab-pane fade" id="helpNotes" role="tabpanel">
                <div>This system uses mardown to display formatting.</div>
                <div>Learn more about markdown 
                  <a href="https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax" target="_blank">here</a>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="sceneTrackerModal" 
         class="modal" 
         tabindex="-1" 
         role="dialog">
      <div class="modal-dialog" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Scene Tracker</h5>
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
            Add the current HP:
            <input type="number" v-model.number="newPlayerHP" class="form-control form-control-sm" @keypress.enter="addPlayer" ref="newPlayerHP">
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
            <h5 class="modal-title">Edit a Player</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Rename the Player ({{renamePlayerData.target.name || '---'}})
            <input type="text" v-model.trim="renamePlayerData.text" class="form-control form-control-sm" @keypress.enter="renamePlayer" ref="renamePlayer">
            Edit the Player's HP
            <input type="number" v-model.number="renamePlayerData.hp" class="form-control form-control-sm" @keypress.enter="renamePlayer">
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="renamePlayer" :disabled="renamePlayerData.text === ''">Rename</button>
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import { Baddie, Villain } from '../scripts/baddie.js';
  import { unvue } from '../scripts/utilities.js';
  import ChallengesTracker from './challenges.vue';
  import locations from './locations.vue';
  import { mapState } from 'vuex';
  import { diff } from 'deep-diff';
  import showdown from 'showdown';
  const converter = new showdown.Converter();

  export default {
    name: 'SceneTracker',
    components: { ChallengesTracker, locations },
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
          challenges: [],
          locations: [],
          notes: ''
        },
        players: [],
        newPlayerName: '',
        newPlayerHP: 30,
        renamePlayerData: {
          target: {
            name: '',
            hp: 0
          },
          text: '',
          hp: 0
        },
        challenge: {
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
          body: 'Are you sure you want to reset the Scene? All Minions, Lieutenants, Villans, Challenges, Locations, and the Scene Tracker will be removed.'
        }, {
          okText: 'Yes',
          cancelText: 'No'
        })
        .then(r => {
          this.scene.challenges = [];
          this.scene.locations = [];
          this.scene.notes = '';
          this.clearScene();
          this.$store.commit('RESET_SCENE');
        }); 
      },
      addPlayer() {
        if (this.newPlayerName !== '') {
          this.players.push({ name: this.newPlayerName, acted: false, type: 'player', hp: this.newPlayerHP });
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
          this.renamePlayerData.hp = player.hp;
          $("#renamePlayerModal").modal('show');
        }
      },
      renamePlayer() {
        if (this.renamePlayerData.text !== '') {
          this.renamePlayerData.target.name = this.renamePlayerData.text;
          this.renamePlayerData.target.hp = this.renamePlayerData.hp;
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
        this.minions.forEach(x => x.resetRound());
        this.scene.acted = false;
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
      },
      markdownNotes() {
        return converter.makeHtml(this.scene.notes);
      }
    },
    created() {
      const sceneData = Cookies.getJSON('sceneTracker');
      if (sceneData) {
        this.scene.green = sceneData.green || [];
        this.scene.yellow = sceneData.yellow || [];
        this.scene.red = sceneData.red || [];
        this.scene.challenges = sceneData.challenges || [];
        this.scene.locations = sceneData.locations || [];
        this.scene.name = sceneData.name || '';
        this.scene.text = sceneData.text || '';
        this.scene.acted = sceneData.acted || false;
        this.scene.notes = sceneData.notes || '';
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