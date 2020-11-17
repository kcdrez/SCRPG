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
                    @click="scene.clear()" 
                    title="Clear the Scene Tracker">Clear Scene</button>
            <button class="btn btn-sm btn-danger border-dark" 
                    @click="resetScene"
                    title="Reset the Environment, removing the Scene Tracker and all Minions, Lieutenants, Villains, and Challenges">Reset Scene</button>
          </div>
          <div v-if="scene.isEmpty">
            There is no Scene Tracker.
          </div>
          <div v-else>
            <h4>{{scene.name}}</h4>
            <div v-for="(item, index) in scene.green" 
                 class="d-inline" 
                 @click="scene.progressScene(item)" 
                 :key="'green' + index">
              <img src="images/green_checked.png" 
                   v-if="item.checked">
              <img src="images/green.png" 
                   v-else>
            </div>
            <div v-for="(item, index) in scene.yellow" 
                 class="d-inline" 
                 @click="scene.progressScene(item)"
                 :key="'yellow' + index">
              <img src="images/yellow_checked.png" 
                   v-if="item.checked">
              <img src="images/yellow.png" 
                   v-else>
            </div>
            <div v-for="(item, index) in scene.red" 
                 class="d-inline" 
                 @click="scene.progressScene(item)"
                 :key="'red' + index">
              <img src="images/red_checked.png" 
                   v-if="item.checked">
              <img src="images/red.png" 
                   v-else>
            </div>
          </div>
          <Locations />
          <ChallengesTracker />
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
                      @click="$store.dispatch('resetRound')" 
                      title="Reset the round, marking all actors to not having acted yet">Reset Round Tracker</button>
            </div>
          </div>
          <table class="table table-sm table-bordered table-dark table-stripped" 
                 v-if="actors.length > 0">
            <thead class="text-center">
              <tr>
                <th width="30%">Name (Owner)</th>
                <th width="25%">Type</th>
                <th width="20%">HP/Die Size</th>
                <th width="25%">Actions</th>
              </tr>
            </thead>
            <tbody class="text-center">
              <template v-for="actor in actors">
                <template v-if="!!actor.name">
                  <tr v-for="(item, index) in actor.list"
                      :key="item.id">
                    <td class="text-capitalize c-pointer align-middle">
                      <input class="form-control form-control-sm"
                            v-model="actor.tempName"
                            v-if="actor.editing">
                      <div v-else
                          @click="actor.takenAction(index)"
                          :title="`Click to toggle this ${actor.typeLabel} to have acted already in the current round`">
                        <span v-if="item.acted">
                          <icon :icon="['fas', 'check']"
                                class="text-success" />
                        </span>
                        {{actor.name}} <template v-if="actor.owner">({{actor.owner.name}})</template>
                      </div>
                    </td>
                    <td class="text-capitalize c-pointer align-middle"
                        @click="actor.takenAction(index)"
                        :title="`Click to toggle this ${actor.typeLabel} to have acted already in the current round`">
                      {{actor.typeLabel}}
                    </td>
                    <td class="align-middle">
                      <template v-if="typeof item.hp === 'number'">
                        <input type="number"
                                class="form-control form-control-sm"
                                v-model.number="item.tempHP" 
                                v-if="item.editing"
                                min="0">
                        <template v-else>
                          {{item.hp}}
                          <span @click="item.hp++">
                            <icon :icon="['fas', 'chevron-circle-up']" 
                                  title="Increase Player HP" 
                                  class="c-pointer" />
                          </span>
                          <span @click="item.hp--">
                            <icon :icon="['fas', 'chevron-circle-down']" 
                                  title="Decrease Player HP" 
                                  class="c-pointer" />
                          </span>
                        </template>
                      </template>
                      <template v-else-if="item.size">
                        <img :src="`images/d${item.size}.png`"
                            :title="`This minion uses a d${item.size}`">
                      </template>
                    </td>
                    <td class="align-middle">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-secondary border-dark"
                                @click="item.beginEdit()"
                                title="Edit this player"
                                v-if="item.allowEdit">
                          <icon :icon="['far', 'edit']" />
                        </button>
                        <button class="btn btn-success border-dark"
                                @click="item.saveEdit()"
                                v-if="item.editing"
                                title="Save edits on this player">
                          <icon :icon="['far', 'save']" />
                        </button>
                        <button class="btn btn-warning border-dark"
                                @click="item.cancelEdit()"
                                v-if="item.editing"
                                title="Cancel edits on this player">
                          <icon :icon="['fas', 'ban']" />
                        </button>
                        <button class="btn btn-primary border-dark add-minion"
                                title="Add a Minion"
                                @click="$emit('add-minion', item.id)"
                                v-if="item.allowAddMinion">
                          <span class="fa-stack">
                            <i class="fas fa-dragon" data-fa-transform="right-4 down-4"></i>
                            <i class="fas fa-plus" data-fa-transform="shrink-6 left-4 down-4"></i>
                          </span>
                        </button>
                        <button class="btn btn-danger border-dark"
                                @click="$store.dispatch('removePlayer', item.name)" 
                                title="Remove this Player from the scene"
                                v-if="item.allowRemove">
                          <icon :icon="['far', 'trash-alt']" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
          <hr />
          <div>
            <h4 class="text-center">Notes</h4>
            <div class="editor">
              <editor-menu-bar :editor="editor"
                                v-slot="{ commands, isActive }">
                <div class="menubar">
                  <button class="menubar__button"
                          :class="{ 'is-active': isActive.bold() }"
                          @click="commands.bold"
                          title="Bold">
                    <icon :icon="['fas', 'bold']" />
                  </button>
                  <button class="menubar__button"
                          :class="{ 'is-active': isActive.italic() }"
                          @click="commands.italic"
                          title="Italic">
                    <icon :icon="['fas', 'italic']" />
                  </button>
                  <button class="menubar__button"
                          :class="{ 'is-active': isActive.strike() }"
                          @click="commands.strike"
                          title="Strikethrough">
                    <icon :icon="['fas', 'strikethrough']" />
                  </button>
                  <button class="menubar__button"
                          :class="{ 'is-active': isActive.underline() }"
                          @click="commands.underline"
                          title="Underline">
                    <icon :icon="['fas', 'underline']" />
                  </button>
                  <button class="menubar__button"
                          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                          @click="commands.heading({ level: 1 })"
                          title="Heading 1">
                    <icon :icon="['fas', 'heading']" />1
                  </button>
                  <button class="menubar__button"
                          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                          @click="commands.heading({ level: 2 })"
                          title="Heading 2">
                    <icon :icon="['fas', 'heading']" />2
                  </button>
                  <button class="menubar__button"
                          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                          @click="commands.heading({ level: 3 })"
                          title="Heading 3">
                    <icon :icon="['fas', 'heading']" />3
                  </button>
                  <button class="menubar__button"
                          :class="{ 'is-active': isActive.bullet_list() }"
                          @click="commands.bullet_list"
                          title="Unordered List">
                    <icon :icon="['fas', 'list-ul']" />
                  </button>
                  <button class="menubar__button"
                          :class="{ 'is-active': isActive.ordered_list() }"
                          @click="commands.ordered_list"
                          title="Ordered List">
                    <icon :icon="['fas', 'list-ol']" />
                  </button>
                  <button class="menubar__button"
                          @click="commands.horizontal_rule"
                          title="Horizonal Line">
                    <icon :icon="['fas', 'grip-lines']" />
                  </button>
                  <button class="menubar__button"
                          @click="commands.undo"
                          title="Undo">
                    <icon :icon="['fas', 'undo']" />
                  </button>
                  <button class="menubar__button"
                          @click="commands.redo"
                          title="Redo">
                    <icon :icon="['fas', 'redo']" />
                  </button>
                </div>
              </editor-menu-bar>
              <editor-content class="editor-container"
                              :editor="editor" />
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
              <input class="form-control"
                     v-model.trim="text"
                     type="text"
                     ref="scene"
                     @keypress.enter="createScene">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Green</div>
              </div>
              <input class="form-control"
                     v-model.number="green"
                     type="number"
                     ref="green"
                     @keypress.enter="createScene">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Yellow</div>
              </div>
              <input class="form-control"
                     v-model.number="yellow"
                     type="number"
                     ref="yellow"
                     @keypress.enter="createScene">
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">Red</div>
              </div>
              <input class="form-control"
                     v-model.number="red" 
                     type="number"
                     ref="red"
                     @keypress.enter="createScene">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary"
                    type="button"
                    data-dismiss="modal"
                    @click="createScene"
                    :disabled="scene.text === ''">Create</button>
            <button class="btn btn-secondary"
                    type="button"
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="addPlayerModal"
         class="modal"
         tabindex="-1"
         role="dialog">
      <div class="modal-dialog"
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a Player</h5>
            <button type="button"
                    class="close"
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Add a player to the Scene.
            <input type="text"
                   v-model.trim="newPlayer.name"
                   class="form-control form-control-sm"
                   @keypress.enter="addPlayer"
                   ref="newPlayerName">
            Add the current HP:
            <input type="number"
                   v-model.number="newPlayer.hp"
                   class="form-control form-control-sm"
                   @keypress.enter="addPlayer"
                   min="0"
                   ref="newPlayerHP">
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary"
                    type="button"
                    data-dismiss="modal"
                    @click="addPlayer"
                    :disabled="newPlayer.name === ''">Create</button>
            <button class="btn btn-secondary"
                    type="button"
                    data-dismiss="modal">Close</button>
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
  import Locations from './locations.vue';
  import { mapState, mapGetters } from 'vuex';
  import { diff } from 'deep-diff';
  import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
  import {
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    Bold,
    Italic,
    Strike,
    Underline,
    History
  } from 'tiptap-extensions';

  export default {
    name: 'SceneTracker',
    components: { ChallengesTracker, Locations, EditorContent, EditorMenuBar },
    data() {
      return {
        green: 2,
        yellow: 4,
        red: 2,
        text: '',
        editor: null,
        newPlayer: {
          name: '',
          hp: 30
        }
      }
    },
    methods: {
      createScene() {
        if (this.text !== '') {
          this.scene.create(this.green, this.yellow, this.red, this.text);
          $('#sceneTrackerModal').modal('hide');
        }
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
          this.$store.dispatch('resetScene');
        });
      },
      addPlayer() {
        if (this.newPlayer.name !== '') {
          this.$store.dispatch('addPlayer', this.newPlayer);
          $('#addPlayerModal').modal('hide');
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
          this.$store.dispatch('resetPlayers');
        });
      }
    },
    computed: {
      ...mapGetters([
        'actors'
      ]),
      ...mapState([
        'scene'
      ])
    },
    mounted() {
      $('#sceneTrackerModal').on('shown.bs.modal', e => {
        this.$refs.scene.focus();
      });
      $('#addPlayerModal').on('shown.bs.modal', e => {
        this.$refs.newPlayerName.focus();
      });
      this.editor = new Editor({
        content: this.scene.notes,
        extensions: [
          new BulletList(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History()
        ],
        onUpdate: (e) => {
          this.scene.setNote(e.getHTML());
        }
      })
    },
    beforeDestroy() {
      this.editor.destroy();
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

  .add-minion {
    width: 40px;

    .fa-stack {
      left: -4px;
    }
  }

  .menubar__button {
    font-weight: 700;
    display: -webkit-inline-box;
    display: inline-flex;
    background: transparent;
    border: 0;
    color: #000;
    padding: .2rem .5rem;
    margin-right: .2rem;
    border-radius: 3px;
    cursor: pointer;

    &.is-active {
      background-color: rgba(0,0,0,.1);
    }
  }
  .editor-container {
    color: #495057;
    border: 1px solid #ced4da;
    background-color: #fff;
    padding: 0.25rem .5rem;
    border-radius: 5px;

    /deep/ .ProseMirror {
      margin: 0 !important;
      min-height: 100px;

      p {
        margin: 0;
      }
    }

    hr {
      background-color: black;
    }
  }
  input.hp {
    width: 30px;
  }
</style>