<template>
  <div class="scene-tracker">
    <div class="row scene-tracker-header">
      <div class="col">
        <h3><a href="#sceneTrackerData" data-toggle="collapse">Environment</a></h3>
      </div>
    </div>
    <div id="sceneTrackerData" class="collapse show">
      <div class="row">
        <div class="col-7">
          <h4>Scene Tracker</h4>
          <div class="btn-group btn-group-sm w-50">
            <button class="btn btn-sm btn-success border-dark" 
              data-toggle="modal" data-target="#sceneTrackerModal" title="Create a new Scene Tracker">Create</button>
            <button class="btn btn-sm btn-warning border-dark" @click="clearScene" title="Clear the Scene Tracker">Clear</button>
            <button class="btn btn-sm btn-danger border-dark" @click="resetScene" 
              title="Reset the Environment, removing the Scene Tracker and all minions, lieutenants, and villains">Reset</button>
          </div>
          <div class="" v-if="noScenes">
            There is no Scene Tracker.
          </div>
          <div class="" v-else>
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
        </div>
        <div class="col-5">
          <h4 class="text-center">Round Tracker</h4>
          <div class="text-center mb-3">
            <div class="btn-group btn-group-sm w-75 mx-auto">
              <button class="btn btn-success border-dark" data-toggle="modal" data-target="#addPlayerModal" title="Add a new player to the scene">Add Player</button>
              <button class="btn btn-danger" title="Clear all players from the scene" @click="clearPlayers">Clear Players</button>
              <button class="btn btn-warning border-dark" @click="resetRound" title="Reset the round, marking all actors to not having acted yet">Reset Actors</button>
            </div>
          </div>
          <table class="table table-sm table-bordered table-dark table-stripped">
            <thead class="text-center">
              <tr>
                <th>Actor Name</th>
                <th>Actor Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <tr v-for="item in roundData" :key="'roundTracker' + item.name">
                <td>
                  <i class="fa fa-check text-success" v-if="item.acted"></i>
                  {{item.name}}
                </td>
                <td class="text-capitalize">{{item.type || item.baddieType}}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-primary" @click="actorActed(item)" title="Toggle this actor to have been acted already in this round">Acted</button>
                    <button class="btn btn-secondary" v-if="item.type === 'player'" @click="renamePlayerModal(item)" title="Rename this player">Rename</button>
                    <button class="btn btn-danger" v-if="item.type === 'player'" @click="removePlayer(item.name)" title="Remove this player from the scene">Remove</button>
                  </div>
                </td>
              </tr>
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
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="createScene">Create</button>
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
            <input type="text" v-model="newPlayerName" class="form-control form-control-sm" @keypress.enter="addPlayer" ref="newPlayerName">
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="addPlayer">Create</button>
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
            Rename the player ({{this.renamePlayerData.target.name || '---'}})
            <input type="text" v-model.trim="renamePlayerData.text" class="form-control form-control-sm" @keypress.enter="renamePlayer" ref="renamePlayer">
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" type="button" data-dismiss="modal" @click="renamePlayer">Rename</button>
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
          red: []
        },
        players: [],
        newPlayerName: '',
        renamePlayerData: {
          target: {
            name: ''
          },
          text: ''
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
        $('#sceneTrackerModal').modal('hide');
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
      resetScene() {
        this.$dialog.confirm({
          title: 'Are You Sure?',
          body: 'Are you sure you want to reset the scene? All minions, lieutenants, villans, and scene tracker will be removed.'
        })
        .then(r => {
          this.clearScene();
          this.$store.commit('RESET_SCENE');
        });
      },
      addPlayer() {
        if (this.newPlayerName !== '') {
          this.players.push({name: this.newPlayerName, acted: false, type: 'player'});
          Cookies.set('players', this.players);
          $('#addPlayerModal').modal('hide');
        }
      },
      removePlayer(playerName) {
        const index = this.players.findIndex(x => x.name === playerName);
        if (index > -1) {
          this.players.splice(index, 1);
          Cookies.set('players', this.players);
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
          Cookies.set('players', this.players);
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
      actorActed(actor) {
        if (actor instanceof Baddie || actor instanceof Villain) {
          actor.takenAction();
        } else {
          actor.acted = !actor.acted;
          Cookies.set('players', this.players);
        }
      },
      resetRound() {
        this.roundData.forEach(item => item.acted = false);
      }
    },
    computed: {
      noScenes() {
        return this.scene.green.length === 0 &&
          this.scene.yellow.length === 0 &&
          this.scene.red.length === 0;
      },
      roundData() {
        return this.players.concat(this.villains, this.lieutenants, this.minions);
      },
      ...mapState([
        'minions',
        'lieutenants',
        'villains'
      ])
    },
    created() {
      const sceneData = Cookies.getJSON('sceneTracker');
      if (sceneData) {
        this.scene.green = sceneData.green;
        this.scene.yellow = sceneData.yellow;
        this.scene.red = sceneData.red;
      }

      const playerData = Cookies.getJSON('players');
      if (playerData) {
        this.players = playerData;
      }
    },
    mounted() {
      $('#sceneTrackerModal').on('shown.bs.modal', e => {
        this.$refs.green.focus();
      });
      $('#addPlayerModal').on('shown.bs.modal', e => {
        this.$refs.newPlayerName.focus();
      });
      $('#addPlayerModal').on('shown.bs.modal', e => {
        this.$refs.renamePlayer.focus();
      });
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

    ul {
      padding: 0;

      li {
        cursor: pointer;
        list-style-type: none;
        padding: .25rem;

        &:hover {
          background-color: lightgray;
          border-radius: 5px;
        }
        
        &.acted {
        }
      }
    }
  }
</style>