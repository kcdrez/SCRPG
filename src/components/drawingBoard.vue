<template>
  <div>
    <div class="util-buttons">
      <button class="btn btn-primary"
              @click="goToSelection()">View Details</button>
      <button class="btn btn-danger"
              @click="removeSelection()">Remove Selected</button>
      <button class="btn btn-warning"
              @click="debug()">debug</button>              
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
  import { fabric } from 'fabric';
  import { addBaddie, addPlayer, addVillain } from '../scripts/fabric/fabric.actor';
  import { addLocation } from '../scripts/fabric/fabric.scene';
  import { initCanvas } from '../scripts/fabric/fabric.common';
  import { mapState, mapGetters } from 'vuex';
  import _ from 'lodash';

  export default {
    name: 'DrawingBoard',
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
      },
      refreshCanvas(array, type, callback) {
        this.canvas.getObjects().forEach(canvasEl => {
          const match = array.find(el => el.id === canvasEl.id);
          if (match) {
            if ('instances' in match) {
              const matchInstance = match.instances.find(instance => {
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

        array.forEach(el => {
          if ('instances' in el) {
            el.instances.forEach((instance, index) => {
              const canvasMatch = this.canvas.getObjects().find(canvasEl => {
                return canvasEl.id === el.id && canvasEl.instanceId === instance.id;
              });
              if (!canvasMatch) {
                callback(this.canvas, el, instance, index);
              }
            });
          } else {
            const canvasMatch = this.canvas.getObjects().find(canvasEl => canvasEl.id === el.id);
            if (!canvasMatch) {
              callback(this.canvas, el);
            }
          }
        });
      },
      removeSelection() {
        const el = this.canvas.getActiveObject();
        if (el && el.id) {
          switch (el.actorType) {
            case 'minion': {
              const match = this.minions.find(x => x.id === el.id);
              match.removeInstance(el.instanceId);
              break;
            }
            case 'lieutenant': {
              const match = this.lieutenants.find(x => x.id === el.id);
              match.removeInstance(el.instanceId);
              break;
            }
            case 'player': {
              const match = this.players.find(x => x.id === el.id);
              match.remove();
              break;
            }
            case 'villain': {
              const match = this.villains.find(x => x.id === el.id);
              match.remove();
              break;
            }
            case 'location': {
              const index = this.locations.findIndex(x => x.id === el.id);
              this.$store.state.scene.removeLocation(index);
              break;
            }
          }
        }
      },
      debug() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject.type === "group") {
          const items = activeObject._objects;
          activeObject._restoreObjectsState();
          this.canvas.remove(activeObject);
          for (let i = 0; i < items.length; i++) {
            this.canvas.add(items[i]);
            this.canvas.item(this.canvas.size() - 1).hasControls = true;
          }

          this.canvas.renderAll();
        }
      }
    },
    computed: {
      ...mapState([ 'minions', 'lieutenants', 'players', 'villains' ]),
      locations() {
        return _.cloneDeep(this.$store.getters.locations);
      }
    },
    mounted() {
      this.canvas = initCanvas('canvas');
      this.refreshCanvas(this.locations, 'location', addLocation);
      // this.locations.forEach(location => {
      //   addLocation(this.canvas, location.name, location.id);
      // });
    },
    watch: {
      players: {
        handler(newVal, oldVal) {
          this.refreshCanvas(newVal, 'player', addPlayer);
        },
        deep: true
      },
      minions: {
        handler(newVal) {
          this.refreshCanvas(newVal, 'minion', addBaddie);
        },
        deep: true
      },
      lieutenants: {
        handler(newVal) {
          this.refreshCanvas(newVal, 'lieutenant', addBaddie);
        },
        deep: true
      },
      villains: {
        handler(newVal, oldVal) {
          this.refreshCanvas(newVal, 'villain', addVillain);
        },
        deep: true
      },
      locations: {
        handler(newVal, oldVal) {
          this.refreshCanvas(newVal, 'location', addLocation);
          // newVal.forEach(location => {
          //   addLocation(this.canvas, location.name, location.id);
          // });

          // oldVal.forEach(location => {
          //   const match = newVal.find(x => x.id === location.id);
          //   if (!match) {
          //     const canvasMatch = this.canvas.getObjects().find(x => x.id === location.id);
          //     this.canvas.remove(canvasMatch);
          //   }
          // });
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