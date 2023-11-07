<template>
  <div>
    <Legend />
    <DrawingBoardButtons :canvas="canvas" @modify="modify($event)" />
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";

import { addBaddie, addPlayer, addVillain } from "scripts/fabric/fabric.actor";
import { addLocation, addChallenge } from "scripts/fabric/fabric.scene";
import { initCanvas } from "scripts/fabric/fabric.common";
import Legend from "./legend.vue";
import DrawingBoardButtons from "components/drawingBoard/drawingBoardButtons.vue";

export default defineComponent({
  name: "DrawingBoard",
  components: { Legend, DrawingBoardButtons },
  setup() {
    let canvas = null;

    return {
      canvas,
    };
  },
  data() {
    return {
      states: [],
      mod: 0,
    };
  },
  methods: {
    ...mapActions(["selectObject", "moveObject"]),
    refreshCanvas(array, type, callback) {
      this.canvas.getObjects().forEach((canvasEl) => {
        if (canvasEl.actorType === type) {
          const exists = array.find((x) => x.id === canvasEl.id);
          if (!exists) {
            this.canvas.remove(canvasEl);
          }
        }
      });

      array.forEach((m) => {
        const match = this.canvas.getObjects().find((x) => x.id === m.id);
        if (match) {
          if (match.dieSize !== m.dieSize) {
            this.canvas.remove(match);
            callback(this.canvas, m);
          }
        } else {
          callback(this.canvas, m);
        }
      });
    },
    modify({ target, modifierType }) {
      let match;
      if (target.type === "player") {
        match = this.players.find((x) => x.id === target.id);
      } else if (target.type === "villain") {
        match = this.villains.find((x) => x.id === target.id);
      } else if (target.type === "minion") {
        match = this.minions.find((x) => x.id === target.id);
      } else if (target.type === "lieutenant") {
        match = this.lieutenants.find((x) => x.id === target.id);
      }

      if (match) {
        this.$dialog.modifyActor({ type: modifierType, target: match });
      }
    },
  },
  computed: {
    ...mapState(["minions", "lieutenants", "players", "villains"]),
    ...mapGetters(["locations", "challenges"]),
  },
  async mounted() {
    this.canvas = initCanvas(this.$refs.canvas);

    this.minions.forEach((m) => addBaddie(this.canvas, m));
    this.lieutenants.forEach((l) => addBaddie(this.canvas, l));
    this.players.forEach((p) => addPlayer(this.canvas, p));
    this.villains.forEach((v) => addVillain(this.canvas, v));
    this.locations.forEach((l) => addLocation(this.canvas, l));
    this.challenges.forEach((c) => addChallenge(this.canvas, c));

    this.canvas.on({
      "selection:updated": (e) => {
        if (e?.selected) {
          e.selected.forEach(({ id, actorType }) => {
            this.selectObject({ id, actorType });
          });
        } else {
          console.warn("selection:updated event couldnt find a target", e);
        }
      },
      "selection:created": (e) => {
        if (e?.selected) {
          e.selected.forEach(({ id, actorType }) => {
            this.selectObject({ id, actorType });
          });
        } else {
          console.warn("selection:created event couldnt find a target", e);
        }
      },
      "selection:cleared": (e) => {
        if (e?.deselected?.length) {
          this.selectObject({ id: null, actorType: null });
        } else if (e.target) {
          this.selectObject({ id: e.target.id, actorType: e.target.actorType });
        } else {
          console.warn("selection:cleared event couldnt find a target", e);
        }
      },
      "object:modified": (e) => {
        if (e?.target) {
          this.moveObject(e.target);
          // this.update()
        } else {
          console.warn("object:modifed event couldnt find a target", e);
        }
      },
      "object:added": () => {
        // this.update()
      },
    });
  },
  watch: {
    players: {
      handler(newVal) {
        this.refreshCanvas(newVal, "player", addPlayer);
      },
      deep: true,
    },
    minions: {
      handler(newVal) {
        this.refreshCanvas(newVal, "minion", addBaddie);
      },
      deep: true,
    },
    lieutenants: {
      handler(newVal) {
        this.refreshCanvas(newVal, "lieutenant", addBaddie);
      },
      deep: true,
    },
    villains: {
      handler(newVal) {
        this.refreshCanvas(newVal, "villain", addVillain);
      },
      deep: true,
    },
    locations: {
      handler(newVal) {
        this.refreshCanvas(newVal, "location", addLocation);
      },
      deep: true,
    },
    challenges: {
      handler(newVal) {
        this.refreshCanvas(newVal, "challenge", addChallenge);
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import "styles/mixins";
@import "styles/variables.module.scss";

#canvas {
  border: 1px black solid;
}

button {
  min-width: 50px;
  min-height: 45px;
  font-size: 20px !important;
}
</style>
