<template>
  <div>
    <h4 class="mx-3">Legend:</h4>
    <canvas id="legendCanvas"></canvas>
  </div>
</template>

<script>
  import { fabric } from 'fabric';
  import { initCanvas, makeStar } from '../scripts/fabric/fabric.common';
  import css from '../styles/variables.scss';

  export default {
    name: 'Legend',
    data() {
      return {
        canvas: null
      }
    },
    methods: {
    },
    computed: {
    },
    mounted() {
      this.canvas = new fabric.StaticCanvas('legendCanvas', { height: 105, width: 500, backgroundColor: 'white', selection: false });
      const size = 25;
      const fontSize = 20;
      const playerStar = new fabric.Polygon(makeStar(5, size, size / 2, 1.5), {
        fill: css.success,
        stroke: 'black',
        top: 2,
        left: 5
      });
      const playerText = new fabric.Text('- Player', {
        top: size / 2,
        left: playerStar.left + playerStar.width + 5,
        fontSize
      });

      const villainStar = new fabric.Polygon(makeStar(6, size, size / 2, 1), {
        fill: css.danger,
        stroke: 'black',
        top: playerStar.height + 5,
        left: 5
      });
      const villainText = new fabric.Text('- Villain', {
        top: size / 2 + villainStar.height,
        left: villainStar.left + villainStar.width + 5,
        fontSize
      });

      const minionShape = new fabric.Circle({
        radius: size,
        fill: css.warning,
        scaleY: 0.75,
        stroke: 'black',
        strokeWidth: 1,
        top: 5,
        left: playerText.left + playerText.width + 25
      });
      const minionText = new fabric.Text('- Minion', {
        top: size / 2,
        left: minionShape.left + minionShape.width + 10,
        fontSize
      });

      const lieutenantShape = new fabric.Rect({
        fill: css.secondary,
        stroke: 'black',
        strokeWidth: 1,
        height: size,
        width: size * 2,
        top: minionShape.height + minionShape.top + 5,
        left: minionShape.left
      });
      const lieutenantText = new fabric.Text('- Lieutenant', {
        top: lieutenantShape.top,
        left: minionShape.left + minionShape.width + 10,
        fontSize
      });

      const locationShape = new fabric.Rect({
        width: size * 1.5,
        height: size * 1.5,
        stroke: 'black',
        fill: '',
        top: 5,
        left: lieutenantText.left + lieutenantText.width + 25
      });
      const locationText = new fabric.Text('- Location', {
        top: locationShape.top + 5,
        left: locationShape.left + locationShape.width + 10,
        fontSize
      });

      const challengeShape = new fabric.Triangle({
        fill: css.primary,
        stroke: 'black',
        height: size * 1.25,
        width: size * 1.75,
        top: locationShape.top + locationShape.height + 10,
        left: locationShape.left
      });
      const challengeText = new fabric.Text('- Challenge', {
        top: challengeShape.top + 5,
        left: challengeShape.left + challengeShape.width,
        fontSize
      });

      this.canvas.add(playerStar, playerText, 
        villainStar, villainText, 
        minionShape, minionText, 
        lieutenantShape, lieutenantText, 
        locationShape, locationText,
        challengeShape, challengeText);
    },
    watch: {
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