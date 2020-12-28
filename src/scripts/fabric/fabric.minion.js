import { fabric } from 'fabric';
import { unvue } from '../utilities';
import css from '../../styles/variables.scss';

const fontSize = 18;

function initCanvas(canvas) {
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.setWidth(window.innerWidth - 200);
    canvas.renderAll();
  }

  resizeCanvas();

  const width = Math.min(200, canvas.width / 5);

  const unusedRect = new fabric.Rect({
    width,
    height: canvas.height,
    top: 0,
    left: 0,
    fill: '#ccc',
    stroke: 'black'
  });

  const text = new fabric.Textbox('Unused', {
    textAlign: 'center',
    width,
    fill: '#f2f2f2',
    name: 'bob'
  });

  const group = new fabric.Group([ unusedRect, text ], {
    name: 'unused',
    selectable: false,
    hoverCursor: 'default',
  });

  canvas.add(group);

  // canvas.on('object:selected', object => {

  // })
};

function addMinion(canvas, name, id, count) {
  for (let i = 1; i <= count; i++) {
    const circle = new fabric.Circle({
      radius: 50,
      fill: css.warning,
      scaleY: 0.5,
      originX: 'center',
      originY: 'center',
      stroke: 'black',
      strokeWidth: 1
    });
  
    const text = new fabric.Text(`${name} (${i})`, {
      fontSize,
      originX: 'center',
      originY: 'center',
      fill: css.warningText
    });
  
    const { top, left } = getNextUnusedSpace(canvas);
    const exists = removeBaddieIfExists(canvas, id, i);
    const group = new fabric.Group([ circle, text ], {
      top: exists ? exists.top: top,
      left: exists ? exists.left: left,
      id: id,
      countId: i,
      borderColor: css.primary,
      cornerColor: css.primary
    });
  
    canvas.add(group);
  }
};

function addLocation(canvas, name, id) {
  const size = 300;

  const square = new fabric.Rect({
    width: size,
    height: size,
    stroke: 'black',
    fill: ''
  });

  const text = new fabric.Textbox(name, {
    fontSize: fontSize + 4,
    textAlign: 'center',
    width: size,
    top: size / -10
  });

  const exists = removeIfExists(canvas, id);
  const group = new fabric.Group([ square, text ], {
    top: exists ? exists.top: 0,
    left: exists ? exists.left: 225,
    id,
    borderColor: css.primary,
    cornerColor: css.primary,
    actorType: 'location'
  });

  canvas.add(group);
  canvas.sendToBack(group);
};

function addLieutenant(canvas, name, id) {
  const rectOpts = {
    fill: '#ffd480',
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
  const text = new fabric.Textbox(name, textOpts);
  
  const { top, left } = getNextUnusedSpace(canvas);
  const group = new fabric.Group([ rect, text ], {
    left,
    top,
    id,
    borderColor: css.primary,
    cornerColor: css.primary
  });

  canvas.add(group);
};

function addPlayer(canvas, name, id) {
  const size = 70;
  const star = new fabric.Polygon(makeStar(5, size, size / 2, 1.5), {
      fill: css.success,
      stroke: 'black'
    }
  );

  const text = new fabric.Textbox(name, {
    fontSize,
    top: size / 2 + 10,
    left: size / 2,
    textAlign: 'center',
    width: size / 2,
    fill: css.successText
  });

  const { top, left } = getNextUnusedSpace(canvas);
  const exists = removeIfExists(canvas, id);
  const group = new fabric.Group([ star, text ], {
    top: exists ? exists.top: top,
    left: exists ? exists.left: left,
    id,
    borderColor: css.primary,
    cornerColor: css.primary    
  });

  canvas.add(group);
};

function addVillain(canvas, name, id) {
  const size = 70;
  const star = new fabric.Polygon(makeStar(6, size, size / 2, 1), {
      fill: css.danger,
      stroke: 'black'
    }
  );

  const text = new fabric.Textbox(name, {
    fontSize,
    top: size / 2 + 10,
    left: size / 2,
    textAlign: 'center',
    width: size / 2,
    fill: css.dangerText
  });

  const { top, left } = getNextUnusedSpace(canvas);
  const exists = removeIfExists(canvas, id);
  const group = new fabric.Group([ star, text ], {
    top: exists ? exists.top: top,
    left: exists ? exists.left: left,
    id,
    borderColor: css.primary,
    cornerColor: css.primary
  });

  canvas.add(group);
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

function getNextUnusedSpace(canvas, left) {
  let match = null;
  const list = canvas.getObjects();
  const offsetLeft = left ? left - 30 : 10;
  const offsetRight = left ? left + 30 : 60;
  for (let i = 0; i < list.length; i++) {
    const el = list[i];
    //if the element is inside of the unused area and NOT the unused area itself
    if (el.left >= 0 && el.left < 200 && el.name !== 'unused' && el.top >= 0) {
      //if the element is within the vertical slice
      if (el.left >= offsetLeft && el.left <= offsetRight) {
        if (!match || (match.top < el.top)) {
          match = el;
        }
      }
    }
  };
  if (match) {
    const top = match.top + match.height + 10;
    if (top > canvas.height - 40) {
      return getNextUnusedSpace(canvas, offsetLeft + 90);
    } else {
      return { top, left: offsetLeft };
    }
  } else {
    return { top: 50, left: offsetLeft };
  }
};

function getNextLocation(canvas, left) {
  let match = null;
  const list = canvas.getObjects();
  const offsetLeft = left ? left - 100 : 225;
  const offsetRight = left ? left + 30 : 60;
  for (let i = 0; i < list.length; i++) {
    const el = list[i];
    //if the element is a location box
    if (el.actorType === 'location') {
      //if the element is within the vertical slice
      if (el.left >= offsetLeft && el.left <= offsetRight) {
        if (!match || (match.top < el.top)) {
          match = el;
        }
      }
    }
    //if the element is inside of the unused area and NOT the unused area itself
    if (el.left >= 0 && el.left < 200 && el.name !== 'unused' && el.top >= 0) {
    }
  };
  if (match) {
    const top = match.top + match.height + 10;
    if (top > canvas.height - 40) {
      return getNextUnusedSpace(canvas, offsetLeft + 90);
    } else {
      return { top, left: offsetLeft };
    }
  } else {
    return { top: 50, left: offsetLeft };
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

function removeBaddieIfExists(canvas, id, countId) {
  const list = canvas.getObjects();

  const match = list.find(x => {
    return x.id === id && x.countId === countId;
  });
  if (match) {
    canvas.remove(match);
    return { top: match.top, left: match.left };
  } else {
    return null;
  }
};

export { addMinion, addLieutenant, addLocation, addPlayer, addVillain, initCanvas };