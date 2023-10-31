<template>
  <div v-if="list.length > 0">
    <h6>
      <b class="text-capitalize" :class="textClass"> {{ labelPlural }}: </b>
    </h6>
    <div
      class="border position-relative text-center ml-3"
      :class="borderClass"
      v-for="(modifier, index) in list"
      :key="label + index"
    >
      <div
        class="remove-modifier"
        :title="`Remove this ${label}`"
        @click="$emit('remove', index)"
        v-if="!editing"
      >
        &times;
      </div>
      <div v-if="editing" class="m-1">
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <div class="input-group-text border-dark">Name</div>
          </div>
          <input
            class="form-control border-dark"
            v-model.trim="modifier.tempName"
            type="text"
            @keypress.enter="$emit('save-edit')"
            @keydown.esc="$emit('cancel-edit')"
          />
        </div>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <div class="input-group-text border-dark">Amount</div>
          </div>
          <input
            class="form-control border-dark"
            v-model.number="modifier.tempAmount"
            type="number"
            :max="modifier.max"
            :min="modifier.min"
            @keypress.enter="$emit('save-edit')"
            @keydown.esc="$emit('cancel-edit')"
          />
        </div>
        <div class="d-inline" v-if="modifier.type !== 'Defend'">
          <label :for="`mod-persistent-${modifier.id}`" class="c-pointer"
            >Persistent?</label
          >
          <input
            type="checkbox"
            v-model="modifier.tempPersistent"
            @keypress.enter="$emit('save-edit')"
            @keydown.esc="$emit('cancel-edit')"
            :id="`mod-persistent-${modifier.id}`"
          />
        </div>
        <div class="d-inline mx-3" v-if="modifier.type !== 'Defend'">
          <label :for="`mod-exclusive-${modifier.id}`" class="c-pointer"
            >Exclusive?</label
          >
          <input
            type="checkbox"
            v-model="modifier.tempExclusive"
            @keypress.enter="$emit('save-edit')"
            @keydown.esc="$emit('cancel-edit')"
            :id="`mod-exclusive-${modifier.id}`"
          />
        </div>
      </div>
      <template v-else>
        <div>
          <b>Name: </b>
          {{ modifier.name }}
        </div>
        <div>
          <b>Amount: </b>
          {{ amountText(modifier.amount) }}
        </div>
        <div v-if="modifier.persistent" class="font-italic">Persistent</div>
        <div v-if="modifier.exclusive" class="font-italic">Exclusive</div>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModifierComponent",
  props: {
    label: {
      type: String,
      required: true,
    },
    labelPlural: {
      type: String,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
    editing: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    amountText(amount) {
      if (amount > 0) {
        return `+${amount}`;
      } else {
        return amount;
      }
    },
  },
  computed: {
    borderClass() {
      switch (this.label.toLowerCase()) {
        case "bonus":
        default:
          return "border-success";
        case "penalty":
          return "border-warning";
        case "defend":
          return "border-secondary";
      }
    },
    textClass() {
      switch (this.label.toLowerCase()) {
        case "bonus":
        default:
          return "text-success";
        case "penalty":
          return "text-dark-warning";
        case "defend":
          return "text-secondary";
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.remove-modifier {
  position: absolute;
  top: -5px;
  right: 3px;
  cursor: pointer;

  &:hover {
    transform: scale(1.5);
    color: red;
  }
}
.text-dark-warning {
  color: #e6ac00;
}
</style>
