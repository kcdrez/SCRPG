<template>
  <Modal :isOpen="show">
    <template v-slot:header>Add a {{ type }}</template>
    <template v-slot:body>
      <div class="input-group input-group-sm mb-3">
        <div class="input-group-text border-dark">Name</div>
        <input
          class="form-control border-dark"
          type="text"
          v-model.trim="modifier.name"
          @keydown.enter="target.addModifier(modifier)"
          ref="modifierName"
        />
      </div>
      <div class="input-group input-group-sm mb-3">
        <div class="input-group-text border-dark">Amount</div>
        <input
          class="form-control border-dark"
          v-model.number="modifier.amount"
          type="number"
          :max="modifier.max"
          :min="modifier.min"
          @keydown.enter="target.addModifier(modifier)"
        />
      </div>
      <div class="d-flex" v-if="modifier.type !== 'Defend'">
        <label for="mod-persistent" class="c-pointer">Persistent?</label>
        <input
          type="checkbox"
          v-model="modifier.persistent"
          id="mod-persistent"
          class="ms-1"
        />
      </div>
      <div class="d-flex" v-if="modifier.type !== 'Defend'">
        <label for="mod-exclusive" class="c-pointer">Exclusive?</label>
        <input
          type="checkbox"
          v-model="modifier.exclusive"
          id="mod-exclusive"
          class="ms-1"
        />
      </div>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-primary border-dark"
        @click="add()"
        :disabled="!modifier.name"
      >
        Add
      </button>
      <button
        type="button"
        class="btn btn-secondary border-dark"
        @click="close()"
      >
        Close
      </button>
    </template>
  </Modal>
</template>

<script>
import { defineComponent } from "vue";

import Modal from "components/modals/modal.vue";

export default defineComponent({
  name: "ModifyModal",
  components: {
    Modal,
  },
  props: {
    type: {
      type: String,
      required: true,
      validator(val) {
        return val === "Bonus" || val === "Penalty" || val === "Defend";
      },
    },
    target: {
      required: true,
      type: Object,
    },
    show: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      modifier: {
        name: "",
        type: this.type,
        amount: 0,
        max: 0,
        min: 0,
        persistent: false,
        exclusive: false,
      },
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    add() {
      this.target.addModifier(this.modifier);
      this.close();
    },
    reset(val) {
      this.modifier.type = val;
      if (val === "Bonus") {
        this.modifier.max = 4;
        this.modifier.min = 1;
        this.modifier.amount = 1;
      } else if (val === "Penalty") {
        this.modifier.max = -1;
        this.modifier.min = -4;
        this.modifier.amount = -1;
      } else if (val === "Defend") {
        this.modifier.max = 100;
        this.modifier.min = 1;
        this.modifier.amount = 1;
        this.modifier.persistent = false;
        this.modifier.exclusive = false;
      }
    },
  },
  watch: {
    type(val) {
      this.reset(val);
    },
  },
  created() {
    this.reset(this.type);
  },
});
</script>

<style lang="scss" scoped></style>
