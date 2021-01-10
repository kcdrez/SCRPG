<template>
  <div>
    <Legend />
    <div class="btn-group btn-group-sm mb-1 mx-1">
      <button class="btn btn-primary border-dark"
              @click="goToSelection()">View Details</button>
      <button class="btn btn-warning border-dark"
              @click="demote()"
              v-if="selection.instance">Demote Selected</button>
      <button class="btn btn-success border-dark"
              @click="promote()"
              v-if="selection.instance">Promote Selected</button>
      <button class="btn btn-success border-dark"
              @click="boost()"
              v-if="selection.instance">Boost Selected</button>
      <button class="btn btn-warning border-dark"
              @click="hinder()"
              v-if="selection.instance">Hinder Selected</button>
      <button class="btn btn-success border-dark"
              @click="defend()"
              v-if="selection.instance">Defend Selected</button>                                          
      <button class="btn btn-danger border-dark"
              @click="removeSelection()">Remove Selected</button>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
  import { fabric } from 'fabric';
  import _ from 'lodash';
  import { mapState, mapGetters } from 'vuex';
  import { addBaddie, addPlayer, addVillain } from '../scripts/fabric/fabric.actor';
  import { addLocation, addChallenge } from '../scripts/fabric/fabric.scene';
  import { initCanvas } from '../scripts/fabric/fabric.common';
  import Legend from './legend.vue';

  export default {
    name: 'DrawingBoard',
    components: { Legend },
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
              if (!canvasMatch || el.updateCanvas) {
                el.updateCanvas = false;
                callback(this.canvas, el, instance, index);
              }
            });
          } else {
            const canvasMatch = this.canvas.getObjects().find(canvasEl => canvasEl.id === el.id);
            if (!canvasMatch|| el.updateCanvas) {
              el.updateCanvas = false;
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
            case 'challenge': {
              const index = this.challenges.findIndex(x => x.id === el.id);
              this.$store.state.scene.removeChallenge(index);
            }
          }
        }
      },
      demote() {
        let match = null;
        switch (this.selection.type) {
          case 'minion':
            match = this.minions.find(minion => minion.id === this.selection.id);
            break;
          case 'lieutenant':
            match = this.lieutenants.find(lieutenant => lieutenant.id === this.selection.id);
            break;
        }
        if (match) match.demote(this.selection.instance);
      },
      promote() {
        let match = null;
        switch (this.selection.type) {
          case 'minion':
            match = this.minions.find(minion => minion.id === this.selection.id);
            break;
          case 'lieutenant':
            match = this.lieutenants.find(lieutenant => lieutenant.id === this.selection.id);
            break;
        }
        if (match) match.promote(this.selection.instance);
      },
      boost() {
        this.$emit('boostSelected');
      }
    },
    computed: {
      ...mapState([ 'minions', 'lieutenants', 'players', 'villains', 'selection' ]),
      locations() {
        return _.cloneDeep(this.$store.getters.locations);
      },
      challenges() {
        return _.cloneDeep(this.$store.getters.challenges);
      }
    },
    mounted() {
      this.canvas = initCanvas('canvas');
      this.refreshCanvas(this.minions, 'minion', addBaddie);
      this.refreshCanvas(this.lieutenants, 'lieutenant', addBaddie);
      this.refreshCanvas(this.players, 'player', addPlayer);
      this.refreshCanvas(this.villains, 'villain', addVillain);
      this.refreshCanvas(this.locations, 'location', addLocation);
      this.refreshCanvas(this.challenges, 'challenge', addChallenge);
    },
    watch: {
      players: {
        handler(newVal) {
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
        handler(newVal) {
          this.refreshCanvas(newVal, 'villain', addVillain);
        },
        deep: true
      },
      locations: {
        handler(newVal) {
          this.refreshCanvas(newVal, 'location', addLocation);
        },
        deep: true
      },
      challenges: {
        handler(newVal) {
          this.refreshCanvas(newVal, 'challenge', addChallenge);
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
</style>