import { fabric } from 'fabric';
import _ from 'lodash';
import css from '../../styles/variables.scss';
import { makeStar, addGroup, removeIfExists, wrapCanvasText, loadImage, fontSize } from './fabric.common';

async function addBaddie(canvas, baddie, instance, index) {
  const size = 65;

  const textTemp = new fabric.Text(`${baddie.name} (${index + 1})`.replace(/\w+/g, _.capitalize), {
    fontSize,
    originX: 'center',
    originY: 'center',
    textAlign: 'center',
    fill: css.warningText,
    shadow: new fabric.Shadow({
      color: 'black',
      blur: 4,
      offsetX: 2,
      offsetY: 1
    })
  });
  let bgShape = null;
  let actorType = null;
  let text = null;
  let img = null;

  switch (baddie.type.toLowerCase()) {
    case 'minion':
    case 'minions':
    default: {
      text = wrapCanvasText(textTemp, canvas, size + 30, size);
      text.top = -10;
      const scaleYMax = Math.max(text.height / size, 0.5);
      const imgTopOffset = text.text.split('\n').length === 3 ? 22 : 15;

      bgShape = new fabric.Circle({
        radius: size,
        fill: css.warning,
        scaleY: scaleYMax > 1 ? 1 : scaleYMax,
        originX: 'center',
        originY: 'center',
        stroke: 'black',
        strokeWidth: 1
      });

      img = await loadImage(`/dist/images/d${baddie.size}.png`, {
        scaleY: 0.5,
        scaleX: 0.5,
        top: bgShape.radius * bgShape.scaleY - imgTopOffset,
        originY: 'center',
        originX: 'center'
      });

      actorType = 'minion';
      break;
    }
    case 'lieutenant': 
    case 'lieutenants': {
      text = wrapCanvasText(textTemp, canvas, size + 100, size - 20);
      text.top = -15;
      const width = Math.max(text.width + 10, size * 2);
      const height = Math.max(text.height + 40, size - 10);
      const imgTopOffset = text.text.split('\n').length === 2 ? 60 : 47;

      bgShape = new fabric.Rect({
        fill: css.secondary,
        originX: 'center',
        originY: 'center',
        stroke: 'black',
        strokeWidth: 1,
        height,
        width
      });

      img = await loadImage(`../../images/d${baddie.size}.png`, {
        scaleY: 0.5,
        scaleX: 0.5,
        top: bgShape.height - imgTopOffset,
        originY: 'center',
        originX: 'center'
      });
      actorType = 'lieutenant';
      break;
    }
  };

  img.originX = 'center';
  img.originY = 'center';

  const group = new fabric.Group([ bgShape, text, img], {
    id: baddie.id,
    instanceId: instance.id,
    borderColor: css.primary,
    cornerColor: css.primary,
    actorType
  });

  const removed = removeBaddieIfExists(canvas, baddie.id, instance.id);
  const data = (instance.top && instance.left) ? instance : removed;
  addGroup(canvas, group, data);
};

function addPlayer(canvas, playerData) {
  const size = 70;
  const star = new fabric.Polygon(makeStar(5, size, size / 2, 1.5), {
      fill: css.success,
      stroke: 'black'
    }
  );

  const textTemp = new fabric.Text(playerData.name.replace(/\w+/g, _.capitalize), {
    fontSize,
    top: size / 2 + 8,
    left: size,
    originX: 'center',
    textAlign: 'center',
    width: size,
    fill: css.successText,
    shadow: new fabric.Shadow({
      color: 'black',
      blur: 3,
      offsetX: 2,
      offsetY: 2
    })
  });

  const group = new fabric.Group([ star, wrapCanvasText(textTemp, canvas, size + 30, size) ], {
    id: playerData.id,
    borderColor: css.primary,
    cornerColor: css.primary,
    actorType: 'player'
  });
  const removed = removeIfExists(canvas, playerData.id);
  const data = (playerData.top && playerData.left) ? playerData : removed;
  addGroup(canvas, group, data);
};

function addVillain(canvas, villainData) {
  const size = 70;
  const star = new fabric.Polygon(makeStar(6, size, size / 2, 1), {
      fill: css.danger,
      stroke: 'black'
    }
  );

  const textTemp = new fabric.Text(villainData.name.replace(/\w+/g, _.capitalize), {
    fontSize,
    top: size / 2 + 8,
    left: size,
    originX: 'center',
    textAlign: 'center',
    width: size,
    fill: css.dangerText,
    shadow: new fabric.Shadow({
      color: 'black',
      blur: 3,
      offsetX: 2,
      offsetY: 2
    })
  });

  const group = new fabric.Group([ star, wrapCanvasText(textTemp, canvas, size + 30, size) ], {
    id: villainData.id,
    borderColor: css.primary,
    cornerColor: css.primary,
    actorType: 'villain'
  });
  const removed = removeIfExists(canvas, villainData.id);
  const data = (villainData.top && villainData.left) ? villainData : removed;
  addGroup(canvas, group, data);
};

function removeBaddieIfExists(canvas, id, instanceId) {
  const list = canvas.getObjects();

  const match = list.find(x => {
    return x.id === id && x.instanceId === instanceId;
  });
  if (match) {
    canvas.remove(match);
    return { top: match.top, left: match.left };
  } else {
    return null;
  }
};

export { addBaddie, addPlayer, addVillain };