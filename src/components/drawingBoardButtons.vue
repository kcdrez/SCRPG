<template>
  <div class="btn-group btn-group-sm mb-1 mx-1">
    <button
      class="btn btn-primary border-dark"
      @click="goToSelection()"
      :title="`Scroll to view details of ${selection.type}`"
      :disabled="!selection.id"
    >
      <i class="fas fa-eye"></i>
    </button>
    <button
      class="btn btn-danger border-dark"
      @click="removeSelection()"
      :disabled="!selection.id"
      :title="`Delete selected ${selection.type}`"
    >
      <i class="fas fa-trash-alt"></i>
    </button>
    <button
      class="btn btn-secondary border-dark"
      @click="undo()"
      :disabled="mod >= states.length - 1"
      title="Undo"
    >
      <i class="fas fa-undo"></i>
    </button>
    <button
      class="btn btn-secondary border-dark"
      @click="redo()"
      title="Redo"
      :disabled="mod <= 0"
    >
      <i class="fas fa-redo"></i>
    </button>
    <button
      class="btn btn-warning border-dark"
      @click="demote()"
      v-if="selection.type === 'minion' || selection.type === 'lieutenant'"
      :title="`Demote selected ${selection.type}`"
      :disabled="!canDemote(selection)"
    >
      <i class="fas fa-level-down-alt"></i>
    </button>
    <button
      class="btn btn-success border-dark"
      @click="promote()"
      v-if="selection.type === 'minion' || selection.type === 'lieutenant'"
      :title="`Promote selected ${selection.type}`"
      :disabled="!canPromote(selection)"
    >
      <i class="fas fa-level-up-alt"></i>
    </button>
    <button
      class="btn btn-success border-dark"
      @click="modify(selection, 'Bonus')"
      v-if="
        selection.type === 'villain' ||
        selection.type === 'player' ||
        selection.type === 'minion' ||
        selection.type === 'lieutenant'
      "
      :title="`Boost selected ${selection.type}`"
    >
      <img src="images/boost.png" />
    </button>
    <button
      class="btn btn-warning border-dark"
      @click="modify(selection, 'Penalty')"
      v-if="
        selection.type === 'villain' ||
        selection.type === 'minion' ||
        selection.type === 'lieutenant' ||
        selection.type === 'player'
      "
      :title="`Hinder selected ${selection.type}`"
    >
      <img src="images/hinder.png" />
    </button>
    <button
      class="btn btn-success border-dark"
      @click="modify(selection, 'Defend')"
      v-if="
        selection.type === 'villain' ||
        selection.type === 'minion' ||
        selection.type === 'lieutenant' ||
        selection.type === 'player'
      "
      :title="`Defend selected ${selection.type}`"
    >
      <img src="images/defend.png" />
    </button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "DrawingBoardButtons",
  props: {
    canvas: {
      required: true,
      type: [Object, null],
    },
  },
  data() {
    return {
      states: [],
      mod: 0,
      showModifierModal: false,
      modifierTarget: null,
      modifierType: "Bonus",
    };
  },
  computed: {
    ...mapState(["minions", "lieutenants", "players", "villains", "selection"]),
  },
  methods: {
    removeSelection() {
      const el = this.canvas.getActiveObject();
      if (el && el.id) {
        switch (el.actorType) {
          case "minion": {
            const match = this.minions.find((x) => x.id === el.id);
            match.remove();
            break;
          }
          case "lieutenant": {
            const match = this.lieutenants.find((x) => x.id === el.id);
            match.remove();
            break;
          }
          case "player": {
            const match = this.players.find((x) => x.id === el.id);
            match.remove();
            break;
          }
          case "villain": {
            const match = this.villains.find((x) => x.id === el.id);
            match.remove();
            break;
          }
          case "location": {
            const index = this.locations.findIndex((x) => x.id === el.id);
            this.$store.state.scene.removeLocation(index);
            break;
          }
          case "challenge": {
            const index = this.challenges.findIndex((x) => x.id === el.id);
            this.$store.state.scene.removeChallenge(index);
          }
        }
      }
    },
    demote() {
      let match = null;
      switch (this.selection.type) {
        case "minion":
          match = this.minions.find(
            (minion) => minion.id === this.selection.id
          );
          break;
        case "lieutenant":
          match = this.lieutenants.find(
            (lieutenant) => lieutenant.id === this.selection.id
          );
          break;
      }
      if (match) match.demote();
    },
    promote() {
      let match = null;
      switch (this.selection.type) {
        case "minion":
          match = this.minions.find(
            (minion) => minion.id === this.selection.id
          );
          break;
        case "lieutenant":
          match = this.lieutenants.find(
            (lieutenant) => lieutenant.id === this.selection.id
          );
          break;
      }
      if (match) match.promote();
    },
    undo() {
      if (this.mod < this.states.length) {
        this.canvas.clear().renderAll();
        const index = this.states.length - this.mod - 2;
        this.canvas.loadFromJSON(this.states[index]);
        this.canvas.renderAll();
        this.mod += 1;
      }
    },
    redo() {
      if (this.mod > 0) {
        this.canvas.clear().renderAll();
        this.canvas.loadFromJSON(this.states[this.states.length - this.mod]);
        this.canvas.renderAll();
        this.mod -= 1;
      }
    },
    update() {
      this.states.push(JSON.stringify(this.canvas));
    },
    modify(target, modifierType) {
      this.$emit("modify", { target, modifierType });
    },
    canPromote(target) {
      let match;
      if (target.type === "minion") {
        match = this.minions.find((x) => x.id === target.id);
      } else if (target.type === "lieutenant") {
        match = this.minions.find((x) => x.id === target.id);
      }
      if (match) {
        return match?.size < 12;
      }
      return false;
    },
    canDemote(target) {
      let match;
      if (target.type === "minion") {
        match = this.minions.find((x) => x.id === target.id);
      } else if (target.type === "lieutenant") {
        match = this.minions.find((x) => x.id === target.id);
      }
      if (match) {
        return match?.size > 4;
      }
      return false;
    },
    goToSelection() {
      if (this.selection.id) {
        const offset = $("#" + this.selection.id).offset();
        $("html, body").animate({
          scrollTop: offset.top - 100,
        });
      }
    },
  },
});
</script>
