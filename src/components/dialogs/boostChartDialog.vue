<template>
  <Dialog :isOpen="show" @close="$emit('cancel')" class="modal-lg">
    <template v-slot:header>Boost/Hinder Chart</template>
    <template v-slot:body>
      <img
        src="images/boosts.jpeg"
        class="img-fluid"
        @click="$emit('cancel')"
      />
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-secondary border-dark"
        type="button"
        @click="$emit('cancel')"
      >
        Close
      </button>
    </template>
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";

import Dialog from "components/dialogs/dialog.vue";

export default defineComponent({
  name: "BoostChartDialog",
  components: {
    Dialog,
  },
  props: {
    show: {
      required: true,
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped></style>
