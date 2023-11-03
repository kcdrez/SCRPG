<template>
  <Modal :isOpen="show" @close="$emit('close')">
    <template v-slot:header>Create a {{ type }}</template>
    <template v-slot:body>
      <div class="input-group input-group-sm mb-3">
        <div class="input-group-text border-dark">Name</div>
        <input
          class="form-control border-dark"
          v-model.trim="actor.name"
          type="text"
          @keydown.enter="createActor()"
          ref="createName"
        />
      </div>
      <div class="input-group input-group-sm mt-2" v-if="isPlayer">
        <span class="input-group-text border-dark">Max HP</span>
        <input
          type="number"
          v-model.number="actor.maxHp"
          class="form-control border-dark"
          @keydown.enter="createActor"
          min="17"
          max="40"
        />
        <span class="input-group-text border-dark">Current HP</span>
        <input
          type="number"
          v-model.number="actor.hp"
          class="form-control border-dark"
          @keydown.enter="createActor"
          min="0"
          :max="actor.maxHp"
        />
      </div>
      <div class="input-group input-group-sm mb-3" v-if="isMinionOrLieutenant">
        <div class="input-group-text border-dark">Size</div>
        <input
          class="form-control border-dark"
          v-model.number="actor.size"
          type="number"
          step="2"
          min="4"
          max="12"
          @keydown.enter="createActor()"
        />
      </div>
      <div class="input-group input-group-sm mb-3" v-if="isMinionOrLieutenant">
        <div class="input-group-text border-dark">Amount</div>
        <input
          class="form-control border-dark"
          v-model.number="actor.amount"
          type="number"
          min="1"
          @keydown.enter="createActor()"
        />
      </div>
      <div class="input-group input-group-sm mb-3" v-if="isMinionOrLieutenant">
        <div class="input-group-text border-dark">Owner</div>
        <select
          class="form-control border-dark"
          @keydown.enter="createActor()"
          v-model="actor.owner"
        >
          <option :value="null">-</option>
          <option v-for="player in players" :key="player.id" :value="player.id">
            {{ player.name }}
          </option>
          <option
            v-for="villain in villains"
            :key="villain.id"
            :value="villain.id"
          >
            {{ villain.name }}
          </option>
          <option v-if="scene.name" :value="scene.id">
            {{ scene.name }}
          </option>
        </select>
      </div>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary border-dark"
        type="button"
        @click="createActor()"
        :disabled="!actor.name"
      >
        Create
      </button>
      <button
        class="btn btn-secondary border-dark"
        type="button"
        @click="close"
      >
        Close
      </button>
    </template>
  </Modal>
</template>

<script>
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

import Modal from "components/modals/modal.vue";

export default defineComponent({
  name: "CreateActorModal",
  components: {
    Modal,
  },
  props: {
    type: {
      type: String,
      required: true,
      validator(val) {
        return (
          val === "Player" ||
          val === "Minion" ||
          val === "Lieutenant" ||
          val === "Villain"
        );
      },
    },
    show: {
      required: true,
      type: Boolean,
    },
    ownerId: {
      type: [String, null],
    },
  },
  data() {
    return {
      actor: {
        name: "",
        size: 12,
        owner: null,
        amount: 1,
        hp: 40,
        maxHp: 40,
      },
    };
  },
  methods: {
    ...mapActions(["addPlayer", "upsertBaddie"]),
    close() {
      this.$emit("close");
    },
    createActor() {
      if (this.actor.name !== "") {
        if (this.isPlayer) {
          this.addPlayer(this.actor);
        } else {
          for (let i = 0; i < this.actor.amount; i++) {
            this.upsertBaddie({
              type: this.type.toLowerCase() + "s",
              ...this.actor,
            });
          }
        }
      }
      this.close();
    },
  },
  computed: {
    ...mapState(["players", "villains", "scene"]),
    isMinionOrLieutenant() {
      return this.type === "Minion" || this.type === "Lieutenant";
    },
    isPlayer() {
      return this.type === "Player";
    },
  },
  watch: {
    ownerId(newVal) {
      this.actor.owner = newVal;
    },
    type() {
      // this.actor.amount = 1
    },
  },
});
</script>

<style lang="scss" scoped></style>
