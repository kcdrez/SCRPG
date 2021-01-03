import { removeIfExists, fontSize } from './fabric.common';
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
    name: locationData.name
  });
  const { top, left } = getNextLocation(canvas, 0, 200, group);
  group.top = exists ? exists.top: top;
  group.left = exists ? exists.left: left;

  canvas.add(group);
  canvas.sendToBack(group);
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

export { addLocation };