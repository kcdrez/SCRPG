<template>
  <Dialog :isOpen="show" @close="$emit('close')">
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
      <div class="input-group input-group-sm mb-3" v-if="isChallengeOrLocation">
        <span class="input-group-text border-dark">Description</span>
        <textarea
          v-model.trim="actor.description"
          class="form-control border-dark"
          :placeholder="
            type === 'Challenge'
              ? 'Add a description of the challenge (optional)'
              : 'Description'
          "
          @keypress.enter="createActor()"
        >
        </textarea>
      </div>
      <div v-if="type === 'Challenge'">
        <h6 class="text-light">Add some challenge entries (optional):</h6>
        <div class="input-group input-group-sm mb-3">
          <input
            type="text"
            class="form-control border-dark"
            placeholder="Challenge Entry"
            v-model.trim="newChallenge.entry"
            @keydown.enter="addTempChallenge"
          />
          <button
            class="btn btn-primary border-dark"
            type="button"
            @click="addTempChallenge"
            :disabled="newChallenge.entry === ''"
          >
            Add
          </button>
        </div>
        <div
          class="input-group input-group-sm mb-1"
          v-for="(item, index) in newChallenge.list"
          :key="'challenge' + index"
        >
          <input
            type="text"
            class="form-control border-dark"
            placeholder="Challenge Entry Description"
            v-model.trim="item.name"
          />
          <button
            class="btn btn-danger border-dark"
            type="button"
            @click="newChallenge.list.splice(index, 1)"
          >
            Remove
          </button>
        </div>
      </div>
      <div class="input-group input-group-sm mt-2" v-if="isPlayer">
        <span class="input-group-text border-dark">Max HP</span>
        <input
          type="number"
          v-model.number="actor.maxHp"
          class="form-control border-dark"
          @keydown.enter="createActor()"
          min="17"
          max="40"
        />
        <span class="input-group-text border-dark">Current HP</span>
        <input
          type="number"
          v-model.number="actor.hp"
          class="form-control border-dark"
          @keydown.enter="createActor()"
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
      <template v-if="type === 'Scene'">
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-text border-dark">Green</div>
          <input
            class="form-control border-dark"
            v-model.number="newScene.green"
            type="number"
            ref="green"
            min="0"
            @keypress.enter="createActor()"
          />
        </div>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-text border-dark">Yellow</div>
          <input
            class="form-control border-dark"
            v-model.number="newScene.yellow"
            type="number"
            ref="yellow"
            min="0"
            @keypress.enter="createActor()"
          />
        </div>
        <div class="input-group input-group-sm">
          <div class="input-group-text border-dark">Red</div>
          <input
            class="form-control border-dark"
            v-model.number="newScene.red"
            type="number"
            ref="red"
            min="0"
            @keypress.enter="createActor()"
          /></div
      ></template>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary border-dark"
        type="button"
        @click="createActor()"
        :disabled="!valid"
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
  </Dialog>
</template>

<script>
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";

import Dialog from "components/dialogs/dialog.vue";

export default defineComponent({
  name: "CreateActorDialog",
  components: {
    Dialog,
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
          val === "Villain" ||
          val === "Challenge" ||
          val === "Location" ||
          val === "Scene"
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
        owner: this.ownerId,
        amount: 1,
        hp: 40,
        maxHp: 40,
        description: "",
      },
      newChallenge: {
        entry: "",
        description: "",
        list: [],
      },
      newScene: {
        green: 0,
        yellow: 0,
        red: 0,
      },
    };
  },
  methods: {
    ...mapActions(["addPlayer", "upsertBaddie"]),
    close() {
      this.$emit("cancel");
    },
    createActor() {
      if (this.actor.name !== "") {
        if (this.isPlayer) {
          this.addPlayer(this.actor);
        } else if (this.type === "Challenge") {
          this.scene.addChallenge({
            ...this.newChallenge,
            ...this.actor,
          });
          this.newChallenge.list = [];
        } else if (this.type === "Location") {
          this.scene.addLocation(this.actor);
        } else if (this.type === "Scene") {
          this.scene.create(
            this.newScene.green,
            this.newScene.yellow,
            this.newScene.red,
            this.actor.name
          );
        } else {
          for (let i = 0; i < this.actor.amount; i++) {
            this.upsertBaddie({
              type: this.type.toLowerCase() + "s",
              ...this.actor,
            });
          }
        }
      }
      this.$emit("confirm");
    },
    addTempChallenge() {
      if (this.newChallenge.entry !== "") {
        this.newChallenge.list.push({
          name: this.newChallenge.entry,
        });
        this.newChallenge.entry = "";
      }
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
    isChallengeOrLocation() {
      return this.type === "Challenge" || this.type === "Location";
    },
    valid() {
      if (!this.actor.name) {
        return false;
      }

      if (this.isMinionOrLieutenant) {
        if (
          this.actor.amount <= 0 ||
          this.actor.size < 4 ||
          this.actor.size > 12
        ) {
          return false;
        }
      } else if (this.isPlayer) {
        if (this.actor.maxHp <= 0) {
          return false;
        }
      } else if (this.type === "Scene") {
        if (
          this.newScene.green <= 0 &&
          this.newScene.yellow <= 0 &&
          this.newScene.red <= 0
        ) {
          return false;
        }
      }

      return true;
    },
  },
  watch: {
    ownerId(newVal) {
      this.actor.owner = newVal;
    },
    type() {
      this.actor.amount = 1;
    },
  },
});
</script>

<style lang="scss" scoped></style>
