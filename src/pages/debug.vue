<template>
  <div>
    <!-- <navbar /> -->
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
  import { fabric } from 'fabric';
  import { addMinion, addLocation, addLieutenant, addPlayer, initCanvas } from '../scripts/fabric/fabric.minion';
  import { mapState } from 'vuex';

  export default {
    name: 'DebugPage',
    data() {
      return {
        canvas: null
      }
    },
    methods: {
    },
    computed: {
      ...mapState([
        'players'
      ])
    },
    mounted() {
      this.canvas = new fabric.Canvas('canvas', { selection: true, height: 500, width: 1000, backgroundColor: 'white' });
      initCanvas(this.canvas);
      // addMinion(canvas, 'Scary Robot');
      // addLieutenant(canvas, 'Harley Quinn');
      // addLocation(canvas, 'Freedom Tower');
      // addPlayer(canvas, 'Absolute Zero');
    },
    watch: {
      players(newVal) {
        newVal.forEach(player => {
          if (!player.rendered) {
            addPlayer(this.canvas, player.name);
            player.rendered = true;
          }
        })
      }
    }
  };
</script>

<style lang="scss">
  @import '../styles/mixins';
  @import '../styles/variables';

  #canvas {
    border: 1px black solid;
    // background-color: white;
  }
</style>