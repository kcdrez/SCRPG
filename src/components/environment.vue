<template>
  <div class="environment-component">
    <div class="row">
      <div class="col environment-header">
        <h2 class="section-header">
          Environment
          <!-- <a href="#environmentData" data-toggle="collapse">Environment</a> -->
        </h2>
        <div class="btn-group btn-group-sm my-auto">
          <button
            class="btn btn-sm btn-danger border-dark"
            @click="resetEnvironment"
            title="Reset the Environment, removing the Scene Tracker, all Minions, Lieutenants, Villains, and Challenges"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
    <div id="environmentData" class="collapse show">
      <div class="row">
        <div class="col-7">
          <SceneTracker class="mb-3" />
          <Locations class="mb-3" />
          <ChallengesTracker class="mb-3" />
        </div>
        <div class="col-5">
          <RoundTracker
            class="mb-3"
            @add-minion="$emit('add-minion', $event)"
          />
          <EnvironmentNotes class="mb-3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { defineComponent } from "vue";
import { Baddie, Villain } from "../scripts/baddie.js";
import { unvue } from "../scripts/utilities.js";
import ChallengesTracker from "./challenges.vue";
import Locations from "./locations.vue";
import SceneTracker from "./sceneTracker.vue";
import RoundTracker from "./roundTracker.vue";
import EnvironmentNotes from "./environment-notes.vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "Environment",
  components: {
    SceneTracker,
    ChallengesTracker,
    Locations,
    RoundTracker,
    EnvironmentNotes,
  },
  methods: {
    resetEnvironment() {
      this.$dialog
        .confirm(
          {
            title: "Are You Sure?",
            body: "Are you sure you want to reset the Scene? All Minions, Lieutenants, Villans, Challenges, Locations, and the Scene Tracker will be removed. (Players will not be affected)",
          },
          {
            okText: "Yes",
            cancelText: "No",
          }
        )
        .then((r) => {
          this.$store.dispatch("resetEnvironment");
        });
    },
  },
  computed: {
    ...mapState(["scene"]),
  },
});
</script>

<style lang="scss" scoped>
.environment-header {
  display: flex;
  margin-bottom: 0.5rem;

  .btn-group {
    width: 15%;
    margin: 0.5rem;
  }
}
</style>
