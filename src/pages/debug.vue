<template>
  <div>
    <navbar />
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
  import { fabric } from 'fabric';
  import { addMinion, addLocation, addLieutenant, addPlayer } from '../scripts/fabric/fabric.minion';

  export default {
    name: 'DebugPage',
    data() {
      return {
      }
    },
    methods: {
    },
    mounted() {
      const canvas = new fabric.Canvas('canvas', { selection: true, height: 500, width: 1000, backgroundColor: 'white' });
      addMinion(canvas, 'robot');
      addLieutenant(canvas, 'Super robot');
      addLocation(canvas, 'castle');
      addPlayer(canvas, 'Legacy Begacy lorem ipsum')
    },
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