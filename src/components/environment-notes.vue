<template>
  <div>
    <div class="card">
      <div class="card-header text-center">
        <h3>Notes</h3>
      </div>
      <div class="card-body">
        <div class="editor">
          <div class="menubar">
            <button
              class="menubar__button"
              @click="editor.chain().focus().toggleBold().run()"
              title="Bold"
            >
              <i class="fas fa-bold"></i>
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().toggleItalic().run()"
              title="Italic"
            >
              <i class="fas fa-italic"></i>
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().toggleStrike().run()"
              title="Strikethrough"
            >
              <i class="fas fa-strikethrough"></i>
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().toggleUnderline().run()"
              title="Underline"
            >
              <i class="fas fa-underline"></i>
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
              title="Heading 1"
            >
              <i class="fas fa-heading"></i>1
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
              title="Heading 2"
            >
              <i class="fas fa-heading"></i>2
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
              title="Heading 3"
            >
              <i class="fas fa-heading"></i>3
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().toggleBulletList().run()"
              title="Unordered List"
            >
              <i class="fas fa-list-ul"></i>
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().toggleOrderedList().run()"
              title="Ordered List"
            >
              <i class="fas fa-list-ol"></i>
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().setHorizontalRule().run()"
              title="Horizonal Line"
            >
              <i class="fas fa-grip-lines-horizontal"></i>
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().undo().run()"
              title="Undo"
            >
              <i class="fas fa-undo"></i>
            </button>
            <button
              class="menubar__button"
              @click="editor.chain().focus().redo().run()"
              title="Redo"
            >
              <i class="fas fa-redo"></i>
            </button>
          </div>
          <EditorContent
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
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

export default defineComponent({
  name: "EnvironmentNotes",
  components: { EditorContent },
  data() {
    return {
      editor: null,
    };
  },
  computed: {
    ...mapState(["scene"]),
  },
  mounted() {
    this.editor = new Editor({
      content: this.scene.notes,
      extensions: [StarterKit],
      onUpdate: ({ editor }) => {
        this.scene.setNote(editor.getHTML());
      },
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.module.scss";

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
