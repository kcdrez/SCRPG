<template>
  <div class="modal fade" tabindex="-1" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header" v-if="$slots.header" />
        </div>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "Dialog",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      modal: null,
    };
  },
  watch: {
    isOpen() {
      this.toggleDialog();
    },
  },
  methods: {
    toggleDialog() {
      if (this.isOpen) {
        this.modal.show();
      } else {
        this.modal.hide();
      }
    },
    hide() {
      this.modal.hide();
    },
  },
  created() {
    this.$nextTick(() => {
      this.modal = new Modal(this.$refs.modal);
      this.$refs.modal.addEventListener("hidden.bs.modal", (event) => {
        this.$emit("close");
      });
      this.toggleDialog();
    });
  },
});
</script>
