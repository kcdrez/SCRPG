import { fabric } from 'fabric';

const fontSize = 18;

function initCanvas(canvas) {
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
};

function addMinion(canvas, name) {
  const circle = new fabric.Circle({
    radius: 50,
    fill: '#ffffcc',
    scaleY: 0.5,
    originX: 'center',
    originY: 'center',
    stroke: 'black',
    strokeWidth: 1
  });

  const text = new fabric.Text(name, {
    fontSize,
    originX: 'center',
    originY: 'center'
  });

  const { top, left } = getNextUnusedSpace(canvas);
  const group = new fabric.Group([ circle, text ], {
    left,
    top,
    name
  });

  canvas.add(group);
};

function addLocation(canvas, name) {
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

  const group = new fabric.Group([ square, text ], {
    left: 225,
    top: 0,
    name
  });

  canvas.add(group);
  canvas.sendToBack(group);
};

function addLieutenant(canvas, name) {
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
    name
  });

  canvas.add(group);
};

function addPlayer(canvas, name) {
  const size = 70;
  const star = new fabric.Polygon(makeStar(5, size, size / 2), {
      fill: '#00e600',
      stroke: 'black',
      // angle: 54
    }
  );

  const text = new fabric.Textbox(name, {
    fontSize,
    top: size,
    left: -5,
    textAlign: 'center',
    width: size * 1.1,
    originX: 'center'
  });

  const { top, left } = getNextUnusedSpace(canvas);
  const group = new fabric.Group([ star, text ], {
    top,
    left,
    name,
    padding: -10
  });

  canvas.add(group);
};

function makeStar(spikeCount, outerRadius, innerRadius) {
  const sweep = Math.PI / spikeCount;
  const points = [];
  let angle = 0;

  for (let i = 0; i < spikeCount; i++) {
    let x = outerRadius + Math.cos(angle) * outerRadius;
    let y = outerRadius + Math.sin(angle) * outerRadius;
    points.push({ x, y });
    angle += sweep;

    x = outerRadius + Math.cos(angle) * innerRadius;
    y = outerRadius + Math.sin(angle) * innerRadius;
    points.push({x, y});
    angle += sweep
  }
  return points;
}

function getNextUnusedSpace(canvas, left) {
  let match = null;
  const list = canvas.getObjects();
  const offsetLeft = left ? left - 30 : 10;
  const offsetRight = left ? left + 30 : 60;
  for (let i = 0; i < list.length; i++) {
    const el = list[i];
    if (el.left >= offsetLeft && el.left <= offsetRight) {
      if (el.top >= 50 && el.left >= 0 && el.left < 200 && el.name !== 'unused') {
        if (!match || (match.top < el.top)) {
          match = el;
          break;
        }
      }
    }
  };
  if (match) {
    const top = match.top + match.height + 10;
    if (top > canvas.height) {
      return getNextUnusedSpace(canvas, offsetLeft + 90);
    } else {
      return { top, left: offsetLeft };
    }
  } else {
    return { top: 50, left: offsetLeft };
  }
};

export { addMinion, addLieutenant, addLocation, addPlayer, initCanvas };