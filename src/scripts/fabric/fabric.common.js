import css from '../../styles/variables.scss';
import store from '../../vuex-state/store';
const fontSize = 18;

function initCanvas(canvas) {
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.setWidth(window.innerWidth - 200);
    canvas.renderAll();
  }
  resizeCanvas();

  const unusedRect = new fabric.Rect({
    width: 200,
    height: canvas.height,
    top: 0,
    left: 0,
    fill: css.background,
    stroke: 'black'
  });

  const text = new fabric.Textbox('Unused', {
    textAlign: 'center',
    width: 200,
    fill: css.light,
    name: 'bob'
  });

  const group = new fabric.Group([ unusedRect, text ], {
    name: 'unused',
    selectable: false,
    hoverCursor: 'default',
  });

  canvas.add(group);

  canvas.on('object:moved', e => {
    store.dispatch('moveObject', e.target);
  });
};

function makeStar(spikeCount, outerRadius, innerRadius, initAngle) {
  const sweep = Math.PI / spikeCount;
  const points = [];
  let angle = sweep * initAngle;

  for (let i = 0; i < spikeCount; i++) {
    let x = outerRadius + Math.cos(angle) * outerRadius;
    let y = outerRadius + Math.sin(angle) * outerRadius;
    points.push({ x, y });
    angle += sweep;

    x = outerRadius + Math.cos(angle) * innerRadius;
    y = outerRadius + Math.sin(angle) * innerRadius;
    points.push({x, y});
    angle += sweep;
  }
  return points;
};

function getNextUnusedSpace(canvas, top, left, obj) {
  if (top > canvas.height - 50) {
    return getNextUnusedSpace(canvas, 50, left + 75, obj);
  } else {
    let match = null;
    const list = canvas.getObjects();
    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      if (el.left >= left && el.left < (obj.width + left) && el.top >= top && el.top < (obj.height + top)) {
        match = el;
        break;
      }
    };
    if (match) {
      return getNextUnusedSpace(canvas, top + match.height, left, obj);
    } else {
      return { top, left };
    }
  }
};

function removeIfExists(canvas, id) {
  const list = canvas.getObjects();

  const match = list.find(x => x.id === id);
  if (match) {
    canvas.remove(match);
    return { top: match.top, left: match.left };
  } else {
    return null;
  }
};

export { initCanvas, makeStar, getNextUnusedSpace, removeIfExists, fontSize };