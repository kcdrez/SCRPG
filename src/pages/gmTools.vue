<template>
  <div>
    <navbar />
    <h1 class="text-center">GM Management</h1>
    <div class="container admin-page">
      <Environment @add-minion="$refs.minions.modal('show', $event)" />
      <Baddies label="Minions" 
               :allowOwner="true" ref="minions" />
      <Baddies label="Lieutenants" 
               ref="lieutenants" />
      <Villains ref="villains" 
                @add-minion="$refs.minions.modal('show', $event)" />
    </div>
    <DrawingBoard />
    <div class="scroll-to-top" 
         @click="scrollToTop()"
         title="Scroll to the top of the page"
         :class="showScrollWidget ? 'd-block': 'd-none'">
      <icon :icon="['fas', 'arrow-up']"></icon>
      TOP
    </div>
    <div id="overcomeChartModal"
        class="modal"
        tabindex="-1"
        role="dialog">
      <div class="modal-dialog modal-lg"
          role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Overcome Chart</h3>
            <button type="button"
                    class="close"
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img src="images/overcome.jpeg"
                 class="img-fluid"
                 data-dismiss="modal">
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary border-dark"
                    type="button"
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="boostsChartModal"
        class="modal"
        tabindex="-1"
        role="dialog">
      <div class="modal-dialog modal-lg"
          role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Boost/Hinder Chart</h3>
            <button type="button"
                    class="close"
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img src="images/boosts.jpeg"
                 class="img-fluid"
                 data-dismiss="modal">
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary border-dark"
                    type="button"
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Baddies from '../components/baddie.vue';
  import Environment from '../components/environment.vue';
  import Villains from '../components/villain.vue';
  import _ from 'lodash';
  import DrawingBoard from '../components/drawingBoard.vue';

  export default {
    name: 'GMTools',
    components: { Baddies, Environment, Villains, DrawingBoard },
    data() {
      return {
        showScrollWidget: false
      }
    },
    methods: {
      scrollToTop() {
        $('html').animate({
          scrollTop: 0
        }, 300);
      },
      scrolling: _.debounce(function() { //lodash doesnt like arrow functions for some reason
        this.showScrollWidget = window.scrollY >= 75;
      }, 50)
    },
    created() {
      window.addEventListener('scroll', this.scrolling);
      this.scrolling();
    },
    destroyed() {
      window.removeEventListener('scroll', this.scrolling);
    }
  };
</script>

<style lang="scss">
  @import '../styles/mixins';
  @import '../styles/variables';

  .admin-page {
    max-width: 90%;

    h1 {
      @include shadow-dark();
    }
    .scene-tracker-header, .baddie-list-header {
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