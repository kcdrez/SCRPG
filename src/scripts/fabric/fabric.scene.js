import { removeIfExists, addGroup, wrapCanvasText, fontSize } from './fabric.common';
import css from '../../styles/variables.scss';

function addLocation(canvas, locationData) {
  const size = 300;

  const square = new fabric.Rect({
    width: size,
    height: size,
    stroke: 'black',
    fill: ''
  });

  const text = new fabric.Textbox(locationData.name.replace(/\w+/g, _.capitalize), {
    fontSize: fontSize + 4,
    textAlign: 'center',
    width: size,
    top: size / -10,
    shadow: new fabric.Shadow({
      color: css.background,
      blur: 4,
      offsetX: 2,
      offsetY: 1
    })
  });
  const exists = removeIfExists(canvas, locationData.id);
  const group = new fabric.Group([ square, text ], {
    id: locationData.id,
    borderColor: css.primary,
    cornerColor: css.primary,
    actorType: 'location',
    name: locationData.name,
    top: locationData.top,
    left: locationData.left
  });
  const { top, left } = getNextLocation(canvas, 0, 300, group);
  if (locationData.top) {
    group.top = locationData.top;
  } else if (exists) {
    group.top = exists.top;
  } else {
    group.top = top;
  }

  if (locationData.left) {
    group.left = locationData.left;
  } else if (exists) {
    group.left = exists.left;
  } else {
    group.left = left;
  }

  canvas.add(group);
  canvas.sendToBack(group);
};

function addChallenge(canvas, challengeData) {
  const size = 100;
  const triangle = new fabric.Triangle({
    fill: css.primary,
    stroke: 'black',
    height: size * 0.75,
    width: size
  });

  const textTemp = new fabric.Text(challengeData.name.replace(/\w+/g, _.capitalize), {
    fontSize,
    top: 10,
    left: size / 2,
    originX: 'center',
    textAlign: 'center',
    width: size,
    fill: css.primaryText,
    shadow: new fabric.Shadow({
      color: 'black',
      blur: 3,
      offsetX: 2,
      offsetY: 2
    })
  });
  const text = wrapCanvasText(textTemp, canvas, size, size - 30);
  text.top = size / 2 - text.height / 2 - 5;

  const group = new fabric.Group([ triangle, text ], {
    id: challengeData.id,
    borderColor: css.primary,
    cornerColor: css.primary,
    actorType: 'challenge'
  });

  const removed = removeIfExists(canvas, challengeData.id);
  const data = (challengeData.top && challengeData.left) ? challengeData : removed;
  addGroup(canvas, group, data);
};

function getNextLocation(canvas, top, left, obj) {
  if (top > canvas.height - 100) {
    return getNextLocation(canvas, 0, left + obj.width + 10, obj);
  } else {
    let match = null;
    const list = canvas.getObjects();
    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      if (el.actorType === 'location') {
        if (el.left >= left && el.left < (obj.width + left) && el.top >= top && el.top < (obj.height + top)) {
          match = el;
          break;
        }
      }
    };
    if (match) {
      return getNextLocation(canvas, top + match.height, left, obj);
    } else {
      return { top, left };
    }
  }
};

export { addLocation, addChallenge};