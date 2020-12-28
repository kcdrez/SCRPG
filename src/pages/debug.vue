<template>
  <div>
    <canvas id="canvas"></canvas>
    <div class="util-buttons">
      <button class="btn btn-primary"
              @click="goToSelection">View Details</button>
    </div>
  </div>
</template>

<script>
  import { fabric } from 'fabric';
  import { addMinion, addLocation, addLieutenant, addPlayer, addVillain, initCanvas } from '../scripts/fabric/fabric.minion';
  import { mapState, mapGetters } from 'vuex';
  import _ from 'lodash';

  export default {
    name: 'DebugPage',
    data() {
      return {
        canvas: null
      }
    },
    methods: {
      goToSelection() {
        const el = this.canvas.getActiveObject();
        if (el && el.id) {
          const offset = $('#' + el.id).offset();
          $('html, body').animate({
            scrollTop: offset.top - 100
          });
        }
      }
    },
    computed: {
      ...mapState({
        players: state => _.cloneDeep(state.players),
        minions: state => _.cloneDeep(state.minions),
        lieutenants: state => _.cloneDeep(state.lieutenants),
        villains: state => _.cloneDeep(state.villains),
      }),
      locations() {
        return _.cloneDeep(this.$store.getters.locations);
      }
    },
    mounted() {
      this.canvas = new fabric.Canvas('canvas', { selection: true, height: 500, width: 1000, backgroundColor: 'white' });
      initCanvas(this.canvas);
      this.locations.forEach(location => {
        addLocation(this.canvas, location.name, location.id);
      });
      // this.minions.forEach(minion => {
      //   addMinion(this.canvas, minion.name, minion.id, minion._count);
      // });
    },
    watch: {
      players: {
        handler(newVal, oldVal) {
          newVal.forEach(player => {
            addPlayer(this.canvas, player.name, player.id);
          });
  
          oldVal.forEach(player => {
            const match = newVal.find(x => x.id === player.id);
            if (!match) {
              const canvasMatch = this.canvas.getObjects().find(x => x.id === player.id);
              this.canvas.remove(canvasMatch);
            }
          });
        },
        deep: true
      },
      minions: {
        handler(newVal, oldVal) {
          newVal.forEach(minion => {
            addMinion(this.canvas, minion.name, minion.id, minion._count);
          });
  
          oldVal.forEach(minion => {
            const match = newVal.find(x => x.id === minion.id);
            if (!match) {
              const canvasMatch = this.canvas.getObjects().find(x => x.id === minion.id);
              this.canvas.remove(canvasMatch);
            } else if (match._count !== minion._count) {
              const delta = minion._count - match._count;
              for (let i = match._count + 1; i <= minion._count; i++) {
                const canvasMatch = this.canvas.getObjects().find(x => {
                  return x.id === minion.id && x.countId === i;
                });
                this.canvas.remove(canvasMatch);
              }
            }
          });
        },
        deep: true
      },
      lieutenants: {
        handler(newVal, oldVal) {
          newVal.forEach(lieutenant => {
            addLieutenant(this.canvas, lieutenant.name, lieutenant.id);
          });
  
          oldVal.forEach(lieutenant => {
            const match = newVal.find(x => x.id === lieutenant.id);
            if (!match) {
              const canvasMatch = this.canvas.getObjects().find(x => x.id === lieutenant.id);
              this.canvas.remove(canvasMatch);
            } else if (match._count !== lieutenant._count) {
              const delta = lieutenant._count - match._count;
              for (let i = match._count + 1; i <= lieutenant._count; i++) {
                const canvasMatch = this.canvas.getObjects().find(x => {
                  return x.id === lieutenant.id && x.countId === i;
                });
                this.canvas.remove(canvasMatch);
              }
            }
          });
        },
        deep: true
      },
      villains: {
        handler(newVal, oldVal) {
          newVal.forEach(villain => {
            addVillain(this.canvas, villain.name, villain.id);
          });
  
          oldVal.forEach(villain => {
            const match = newVal.find(x => x.id === villain.id);
            if (!match) {
              const canvasMatch = this.canvas.getObjects().find(x => x.id === villain.id);
              this.canvas.remove(canvasMatch);
            }
          });
        },
        deep: true
      },
      locations: {
        handler(newVal, oldVal) {
          newVal.forEach(location => {
            addLocation(this.canvas, location.name, location.id);
          });

          oldVal.forEach(location => {
            const match = newVal.find(x => x.id === location.id);
            if (!match) {
              const canvasMatch = this.canvas.getObjects().find(x => x.id === location.id);
              this.canvas.remove(canvasMatch);
            }
          });
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss">
  @import '../styles/mixins';
  @import '../styles/variables';

  #canvas {
    border: 1px black solid;
  }
  .canvas-container {
    display: inline-block;
  }
  .util-buttons {
    display: inline;
    button {
      vertical-align: top;
    }
  }
</style>