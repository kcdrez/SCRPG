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
            @click="reset()"
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
          <RoundTracker class="mb-3" />
          <EnvironmentNotes class="mb-3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { defineComponent } from "vue";

import ChallengesTracker from "./challenges.vue";
import Locations from "./locations.vue";
import SceneTracker from "./sceneTracker.vue";
import RoundTracker from "./roundTracker.vue";
import EnvironmentNotes from "./environment-notes.vue";

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
    ...mapActions(["resetEnvironment"]),
    reset() {
      this.$dialog.confirm({
        body: "Are you sure you want to reset the Scene? All Minions, Lieutenants, Villans, Challenges, Locations, and the Scene Tracker will be removed. (Players will not be affected)",
        onConfirmDialog: () => {
          this.resetEnvironment();
        },
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
