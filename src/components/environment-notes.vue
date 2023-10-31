<template>
  <div>
    <div class="card">
      <div class="card-header text-center">
        <h3>Notes</h3>
      </div>
      <div class="card-body">
        <div class="editor">
          <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
            <div class="menubar">
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.bold() }"
                @click="commands.bold"
                title="Bold"
              >
                <icon :icon="['fas', 'bold']" />
              </button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.italic() }"
                @click="commands.italic"
                title="Italic"
              >
                <icon :icon="['fas', 'italic']" />
              </button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.strike() }"
                @click="commands.strike"
                title="Strikethrough"
              >
                <icon :icon="['fas', 'strikethrough']" />
              </button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.underline() }"
                @click="commands.underline"
                title="Underline"
              >
                <icon :icon="['fas', 'underline']" />
              </button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })"
                title="Heading 1"
              >
                <icon :icon="['fas', 'heading']" />1
              </button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })"
                title="Heading 2"
              >
                <icon :icon="['fas', 'heading']" />2
              </button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                @click="commands.heading({ level: 3 })"
                title="Heading 3"
              >
                <icon :icon="['fas', 'heading']" />3
              </button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.bullet_list() }"
                @click="commands.bullet_list"
                title="Unordered List"
              >
                <icon :icon="['fas', 'list-ul']" />
              </button>
              <button
                class="menubar__button"
                :class="{ 'is-active': isActive.ordered_list() }"
                @click="commands.ordered_list"
                title="Ordered List"
              >
                <icon :icon="['fas', 'list-ol']" />
              </button>
              <button
                class="menubar__button"
                @click="commands.horizontal_rule"
                title="Horizonal Line"
              >
                <icon :icon="['fas', 'grip-lines']" />
              </button>
              <button
                class="menubar__button"
                @click="commands.undo"
                title="Undo"
              >
                <icon :icon="['fas', 'undo']" />
              </button>
              <button
                class="menubar__button"
                @click="commands.redo"
                title="Redo"
              >
                <icon :icon="['fas', 'redo']" />
              </button>
            </div>
          </editor-menu-bar>
          <editor-content
            class="editor-container border-dark"
            :editor="editor"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { defineComponent } from "vue";
// import { Editor, EditorContent, EditorMenuBar } from "tiptap";
// import {
//   HardBreak,
//   Heading,
//   HorizontalRule,
//   OrderedList,
//   BulletList,
//   ListItem,
//   Bold,
//   Italic,
//   Strike,
//   Underline,
//   History,
// } from "tiptap-extensions";

export default defineComponent({
  name: "EnvironmentNotes",
  // components: { EditorContent, EditorMenuBar },
  data() {
    return {
      editor: null,
    };
  },
  computed: {
    ...mapState(["scene"]),
  },
  mounted() {
    // this.editor = new Editor({
    //   content: this.scene.notes,
    //   extensions: [
    //     new BulletList(),
    //     new HardBreak(),
    //     new Heading({ levels: [1, 2, 3] }),
    //     new HorizontalRule(),
    //     new ListItem(),
    //     new OrderedList(),
    //     new Bold(),
    //     new Italic(),
    //     new Strike(),
    //     new Underline(),
    //     new History(),
    //   ],
    //   onUpdate: (e) => {
    //     this.scene.setNote(e.getHTML());
    //   },
    // });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.menubar__button {
  font-weight: 700;
  display: -webkit-inline-box;
  display: inline-flex;
  background: transparent;
  border: 0;
  color: #000;
  padding: 0.2rem 0.5rem;
  margin-right: 0.2rem;
  border-radius: 3px;
  cursor: pointer;

  &.is-active {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.editor-container {
  color: #495057;
  border: 1px solid #ced4da;
  background-color: $background-light-5;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;

  ::v-deep(.ProseMirror) {
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
