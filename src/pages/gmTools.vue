<template>
  <div>
    <h1 class="text-center">GM Management</h1>
    <div class="container admin-page">
      <Environment />
      <Players ref="players" />
      <Baddies label="Minions" allowOwner ref="minions" />
      <Baddies label="Lieutenants" ref="lieutenants" />
      <Villains ref="villains" />
    </div>
    <DrawingBoard />
    <div
      class="scroll-to-top"
      @click="scrollToTop()"
      title="Scroll to the top of the page"
      :class="showScrollWidget ? 'd-block' : 'd-none'"
    >
      <i class="fas fa-arrow-up"></i>
      TOP
    </div>
    <Dialog :isOpen="dialogs.showBoostDialog" @close="toggleBoostDialog(false)">
      <template v-slot:header>
        <h3 class="modal-title">Boost/Hinder Chart</h3>
      </template>
      <template v-slot:body>
        <img src="images/boosts.jpeg" class="img-fluid" />
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-secondary border-dark"
          type="button"
          @click="toggleBoostDialog(false)"
        >
          Close
        </button>
      </template>
    </Dialog>
    <Dialog
      :isOpen="dialogs.showOvercomeDialog"
      @close="toggleOvercomeDialog(false)"
    >
      <template v-slot:header>Overcome Chart</template>
      <template v-slot:body>
        <img src="images/overcome.jpeg" class="img-fluid" />
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-secondary border-dark"
          type="button"
          @click="toggleOvercomeDialog(false)"
        >
          Close
        </button>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
import _ from "lodash";

import Baddies from "components/baddie.vue";
import Environment from "components/environment.vue";
import Villains from "components/villain.vue";
import Players from "components/player.vue";
import DrawingBoard from "components/drawingBoard.vue";
import Dialog from "components/dialogs/dialog.vue";

export default defineComponent({
  name: "GMTools",
  components: {
    Baddies,
    Environment,
    Villains,
    Players,
    DrawingBoard,
    Dialog,
  },
  data() {
    return {
      showScrollWidget: false,
    };
  },
  computed: {
    ...mapState(["dialogs"]),
  },
  methods: {
    ...mapActions(["toggleBoostDialog", "toggleOvercomeDialog"]),
    scrollToTop() {
      $("html").animate({ scrollTop: 0 }, 300);
    },
    scrolling: _.debounce(function () {
      //lodash doesnt like arrow functions for some reason
      this.showScrollWidget = window.scrollY >= 75;
    }, 50),
  },
  created() {
    window.addEventListener("scroll", this.scrolling);
    this.scrolling();
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrolling);
  },
});
</script>

<style lang="scss">
@import "../styles/mixins";
@import "../styles/variables.module.scss";

.admin-page {
  max-width: 90%;

  h1 {
    @include shadow-dark();
  }
  .scene-tracker-header,
  .baddie-list-header {
    .col {
      display: flex;
      margin-bottom: 0.5rem;

      h3 {
        margin: 0;
      }
      .btn-group {
        vertical-align: middle;
        margin: 0 1rem;
        width: 15%;
      }
    }
  }
}

.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 100;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  border: black solid 1px;
  background-color: white;
  color: black;
  opacity: 0.6;
  cursor: pointer;

  &:hover {
    border-color: $primary;
    color: $primary;
  }
}
</style>
