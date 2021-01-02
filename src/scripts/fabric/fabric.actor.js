import { fabric } from 'fabric';
import css from '../../styles/variables.scss';
import { makeStar, getNextUnusedSpace, removeIfExists, fontSize } from './fabric.common';

function addMinion(canvas, minion, instance, index) {
  const circle = new fabric.Circle({
    radius: 50,
    fill: css.warning,
    scaleY: 0.5,
    originX: 'center',
    originY: 'center',
    stroke: 'black',
    strokeWidth: 1
  });

  const text = new fabric.Text(`${minion.name} (${index + 1})`, {
    fontSize,
    originX: 'center',
    originY: 'center',
    fill: css.warningText
  });

  const group = new fabric.Group([ circle, text ], {
    id: minion.id,
    instanceId: instance.id,
    borderColor: css.primary,
    cornerColor: css.primary,
    actorType: 'minion'
  });

  const removed = removeBaddieIfExists(canvas, minion.id, instance.id);
  const data = (instance.top && instance.left) ? instance : removed;
  addGroup(canvas, group, data);
};

function addLieutenant(canvas, lieutenantData) {
  lieutenantData.instances.forEach((el, index) => {
    const rectOpts = {
      fill: css.secondary,
      originX: 'center',
      originY: 'center',
      stroke: 'black',
      strokeWidth: 1,
      height: 50,
      width: 120
    };
  
    const textOpts = {
      fontSize,
      originX: 'center',
      originY: 'center'
    };
  
    const rect = new fabric.Rect(rectOpts);
    const text = new fabric.Textbox(lieutenantData.name, textOpts);
  
    const group = new fabric.Group([ rect, text ], {
      id: lieutenantData.id,
      instanceId: el.id,
      borderColor: css.primary,
      cornerColor: css.primary,
      actorType: 'lieutenant'
    });

    const removed = removeBaddieIfExists(canvas, lieutenantData.id, el.id);
    const data = (lieutenantData.top && lieutenantData.left) ? lieutenantData : removed;
    addGroup(canvas, group, data);
  });
};

function addPlayer(canvas, playerData) {
  const size = 70;
  const star = new fabric.Polygon(makeStar(5, size, size / 2, 1.5), {
      fill: css.success,
      stroke: 'black'
    }
  );

  const text = new fabric.Textbox(playerData.name, {
    fontSize,
    top: size / 2 + 10,
    left: size / 2,
    textAlign: 'center',
    width: size / 2,
    fill: css.successText
  });

  const group = new fabric.Group([ star, text ], {
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

  const text = new fabric.Textbox(villainData.name, {
    fontSize,
    top: size / 2 + 10,
    left: size / 2,
    textAlign: 'center',
    width: size / 2,
    fill: css.dangerText
  });

  const group = new fabric.Group([ star, text ], {
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

function addGroup(canvas, group, data) {
  const { top, left } = getNextUnusedSpace(canvas, 50, 0, group);
  group.top = data ? data.top: top;
  group.left = data ? data.left: left;

  canvas.add(group);
}

export { addMinion, addLieutenant, addPlayer, addVillain };