import { fabric } from 'fabric';

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
    fontSize: 20,
    originX: 'center',
    originY: 'center'
  });

  const group = new fabric.Group([ circle, text ], {
    left: 150,
    top: 100
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
    fontSize: size / 5,
    textAlign: 'center',
    width: size,
    top: size / -5
  });

  const group = new fabric.Group([ square, text ], {
    left: 250,
    top: 100
  });

  canvas.add(group);
};

function addLieutenant(canvas, name) {
  const rect = new fabric.Rect({
    fill: '#ffd480',
    originX: 'center',
    originY: 'center',
    width: 100,
    height: 50,
    stroke: 'black',
    strokeWidth: 1
  });

  const text = new fabric.Text(name, {
    fontSize: 20,
    originX: 'center',
    originY: 'center'
  });

  const group = new fabric.Group([ rect, text ], {
    left: 150,
    top: 10
  });

  canvas.add(group);
};

function addPlayer(canvas, name) {
  const size = 75;
  const star = new fabric.Polygon(makeStar(5, size, size / 2), {
      fill: '#00e600',
      // originX: 'center',
      // originY: 'center',
      stroke: 'black',
      angle: 54
    }
  );

  const text = new fabric.Textbox(name, {
    fontSize: size / 5,
    top: size * .9,
    // left: -28,
    textAlign: 'center',
    width: size * 1.1,
    originX: 'center',
    // originY: 'center'
  });

  const group = new fabric.Group([ star, text ], {
    left: 350,
    top: 10
  });

  canvas.add(group);
};

function makeStar(spikeCount, outerRadius, innerRadius) {
  // var rot = Math.PI / 2 * 3;
  // var cx = outerRadius;
  // var cy = outerRadius;
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
    points.push({x: x, y: y});
    angle += sweep
  }
  return (points);
}

export default addMinion;
export { addMinion, addLieutenant, addLocation, addPlayer };