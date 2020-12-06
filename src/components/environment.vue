<template>
  <div class="environment-component">
    <div class="row environment-header">
      <div class="col">
        <h2>
          <a href="#environmentData" 
             data-toggle="collapse">Environment</a>
        </h2>
        <div class="btn-group btn-group-sm my-auto">
          <button class="btn btn-sm btn-danger border-dark"
                  @click="resetEnvironment"
                  title="Reset the Environment, removing the Scene Tracker, all Minions, Lieutenants, Villains, and Challenges">Reset</button>
        </div>
      </div>
    </div>
    <div id="environmentData"
         class="collapse show">
      <div class="row">
        <div class="col-7 text-center environment">
          <SceneTracker />
          <Locations />
          <ChallengesTracker />
        </div>
        <div class="col-5 round-tracker">
          <RoundTracker />
          <hr class="border-dark" />
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
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import { Baddie, Villain } from '../scripts/baddie.js';
  import { unvue } from '../scripts/utilities.js';
  import ChallengesTracker from './challenges.vue';
  import Locations from './locations.vue';
  import SceneTracker from './sceneTracker.vue';
  import RoundTracker from './roundTracker.vue';
  import { mapState } from 'vuex';
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
    name: 'Environment',
    components: { SceneTracker, ChallengesTracker, Locations, RoundTracker, EditorContent, EditorMenuBar },
    data() {
      return {
        editor: null,
      }
    },
    methods: {
      resetEnvironment() {
        this.$dialog.confirm({
          title: 'Are You Sure?',
          body: 'Are you sure you want to reset the Scene? All Minions, Lieutenants, Villans, Challenges, Locations, and the Scene Tracker will be removed. (Players will not be affected)'
        }, {
          okText: 'Yes',
          cancelText: 'No'
        })
        .then(r => {
          this.$store.dispatch('resetEnvironment');
        });
      },        
    },
    computed: {
      ...mapState([
        'scene'
      ])
    },
    mounted() {
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
</style>