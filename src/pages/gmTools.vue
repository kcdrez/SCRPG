<template>
  <div>
    <navbar />
    <div class="container admin-page">
      <div class="row">
        <h1 class="col text-center">GM Management</h1>
      </div>
      <Environment @add-minion="$refs.minions.modal('show', $event)" />
      <Baddies label="Minions" 
               :allowOwner="true" ref="minions" />
      <Baddies label="Lieutenants" 
               ref="lieutenants" />
      <Villains ref="villains" 
                @add-minion="$refs.minions.modal('show', $event)" />
    </div>
    <div id="overcomeChartModal"
        class="modal"
        tabindex="-1"
        role="dialog">
      <div class="modal-dialog modal-lg"
          role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Overcome Chart</h5>
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
            <button class="btn btn-secondary"
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
            <h5 class="modal-title">Boost/Hinder Chart</h5>
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
            <button class="btn btn-secondary"
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

  export default {
    name: 'GMTools',
    components: { Baddies, Environment, Villains }
  };
</script>

<style lang="scss">
  .admin-page {
    max-width: 90%;

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
</style>