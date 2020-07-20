<template>
  <div>
    <navbar />
    <div class="container admin-page">
      <div class="row">
        <h1 class="col text-center">GM Management</h1>
      </div>
      <sceneTracker />
      <baddies label="Minions"></baddies>
      <baddies label="Lieutenants"></baddies>
      <villains />
    </div>
  </div>
</template>

<script>
  import baddies from '../components/baddie.vue';
  import sceneTracker from '../components/sceneTracker.vue';
  import villains from '../components/villain.vue';

  export default {
    name: 'GMTools',
    components: { baddies, sceneTracker, villains }
  };
</script>

<style lang="scss">
  .admin-page {
    max-width: 90%;

    .row {
      margin-bottom: .5rem;
    }
    .scene-tracker-header, .baddie-list-header {
      margin-bottom: 1rem;

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