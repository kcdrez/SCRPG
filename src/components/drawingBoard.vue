<template>
  <div>
    <Legend />
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
        v-if="selection.instance"
        :title="`Demote selected ${selection.type}`"
      >
        <i class="fas fa-level-down-alt"></i>
      </button>
      <button
        class="btn btn-success border-dark"
        @click="promote()"
        v-if="selection.instance"
        :title="`Promote selected ${selection.type}`"
      >
        <i class="fas fa-level-up-alt"></i>
      </button>
      <button
        class="btn btn-success border-dark"
        @click="$emit('modifySelected', 'boost')"
        v-if="selection.instance || selection.type === 'villain'"
        :title="`Boost selected ${selection.type}`"
      >
        <img src="images/boost.png" />
      </button>
      <button
        class="btn btn-warning border-dark"
        @click="$emit('modifySelected', 'hinder')"
        v-if="selection.instance || selection.type === 'villain'"
        :title="`Hinder selected ${selection.type}`"
      >
        <img src="images/hinder.png" />
      </button>
      <button
        class="btn btn-success border-dark"
        @click="$emit('modifySelected', 'defend')"
        v-if="selection.instance || selection.type === 'villain'"
        :title="`Defend selected ${selection.type}`"
      >
        <img src="images/defend.png" />
      </button>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { fabric } from "fabric";
import _ from "lodash";
import { mapState, mapGetters } from "vuex";
import {
  addBaddie,
  addPlayer,
  addVillain,
} from "../scripts/fabric/fabric.actor";
import { addLocation, addChallenge } from "../scripts/fabric/fabric.scene";
import { initCanvas } from "../scripts/fabric/fabric.common";
import Legend from "./legend.vue";
import { unvue } from "../scripts/utilities";

export default defineComponent({
  name: "DrawingBoard",
  components: { Legend },
  data() {
    return {
      canvas: null,
      states: [],
      mod: 0,
    };
  },
  methods: {
    goToSelection() {
      const el = this.canvas.getActiveObject();
      if (el && el.id) {
        const offset = $("#" + el.id).offset();
        $("html, body").animate({
          scrollTop: offset.top - 100,
        });
      }
    },
    async refreshCanvas(array, type, callback) {
      return new Promise(async (resolve, reject) => {
        this.canvas.getObjects().forEach((canvasEl) => {
          const match = array.find((el) => el.id === canvasEl.id);
          if (match) {
            if ("instances" in match) {
              const matchInstance = match.instances.find((instance) => {
                return instance.id === canvasEl.instanceId;
              });
              if (!matchInstance) {
                this.canvas.remove(canvasEl);
              }
            }
          } else if (canvasEl.actorType === type) {
            this.canvas.remove(canvasEl);
          }
        });

        for (let i = 0; i < array.length; i++) {
          const el = array[i];
          if ("instances" in el) {
            for (let j = 0; j < el.instances.length; j++) {
              const instance = el.instances[j];
              const canvasMatch = this.canvas.getObjects().find((canvasEl) => {
                return (
                  canvasEl.id === el.id && canvasEl.instanceId === instance.id
                );
              });
              if (!canvasMatch || el.updateCanvas) {
                el.updateCanvas = false;
                await callback(this.canvas, el, instance, j);
              }
            }
          } else {
            const canvasMatch = this.canvas
              .getObjects()
              .find((canvasEl) => canvasEl.id === el.id);
            if (!canvasMatch || el.updateCanvas) {
              el.updateCanvas = false;
              await callback(this.canvas, el);
            }
          }
        }
        resolve();
      });
    },
    removeSelection() {
      const el = this.canvas.getActiveObject();
      if (el && el.id) {
        switch (el.actorType) {
          case "minion": {
            const match = this.minions.find((x) => x.id === el.id);
            match.removeInstance(el.instanceId);
            break;
          }
          case "lieutenant": {
            const match = this.lieutenants.find((x) => x.id === el.id);
            match.removeInstance(el.instanceId);
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
      if (match) match.demote(this.selection.instance);
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
      if (match) match.promote(this.selection.instance);
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
  },
  computed: {
    ...mapState(["minions", "lieutenants", "players", "villains", "selection"]),
    locations() {
      return _.cloneDeep(this.$store.getters.locations);
    },
    challenges() {
      return _.cloneDeep(this.$store.getters.challenges);
    },
  },
  async mounted() {
    this.canvas = initCanvas("canvas");

    this.canvas.on(
      "object:modified",
      () => {
        this.update();
      },
      "object:added",
      () => {
        this.update();
      }
    );

    await this.refreshCanvas(this.minions, "minion", addBaddie);
    await this.refreshCanvas(this.lieutenants, "lieutenant", addBaddie);
    await this.refreshCanvas(this.players, "player", addPlayer);
    await this.refreshCanvas(this.villains, "villain", addVillain);
    await this.refreshCanvas(this.locations, "location", addLocation);
    await this.refreshCanvas(this.challenges, "challenge", addChallenge);
    this.update();
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
@import "../styles/mixins";
@import "../styles/variables";

#canvas {
  border: 1px black solid;
}

button {
  min-width: 50px;
  min-height: 45px;
  font-size: 20px !important;
}
</style>
