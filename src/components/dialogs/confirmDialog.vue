<template>
  <Dialog :isOpen="show">
    <template v-slot:header>{{ title }}</template>
    <template v-slot:body>
      {{ body }}
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-primary border-dark"
        @click="confirm()"
      >
        {{ okText }}
      </button>
      <button
        type="button"
        class="btn btn-secondary border-dark"
        @click="cancel()"
      >
        {{ cancelText }}
      </button>
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import Dialog from "components/dialogs/dialog.vue";

export default defineComponent({
  name: "ConfirmDialog",
  components: {
    Dialog,
  },
  props: {
    show: {
      required: true,
      type: Boolean,
    },
    title: {
      type: String,
      default: "Are You Sure?",
    },
    body: {
      type: String,
      default: "Are you sure you would like to continue?",
    },
    okText: {
      type: String,
      default: "Yes",
    },
    cancelText: {
      type: String,
      default: "No",
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
});
</script>

<style lang="scss" scoped></style>
