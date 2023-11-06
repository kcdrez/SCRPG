import { fabric } from "fabric";
import css from "../../styles/variables.module.scss";
import store from "../../vuex-state/store";
const fontSize = 18;

function initCanvas(id) {
  const canvas = new fabric.Canvas(id, {
    selection: true,
    height: 700,
    width: 1000,
    backgroundColor: "white",
  });
  window.addEventListener("resize", resizeCanvas, false);

  function resizeCanvas() {
    canvas.setWidth(window.innerWidth - 17);
    canvas.renderAll();
  }
  resizeCanvas();

  const unusedRect = new fabric.Rect({
    width: 300,
    height: canvas.height,
    top: 0,
    left: 0,
    fill: css.background,
    stroke: "black",
  });

  const text = new fabric.Textbox("No Location", {
    textAlign: "center",
    width: 300,
    fill: css.light,
  });

  const group = new fabric.Group([unusedRect, text], {
    name: "unused",
    selectable: false,
    hoverCursor: "default",
  });

  canvas.add(group);

  // canvas.on("object:modified", (e) => {
  //   if (e?.target) {
  //     store.dispatch("moveObject", e.target);
  //   } else {
  //     console.warn("object:modifed event couldnt find a target", e);
  //   }
  // });

  // canvas.on("selection:created", (e) => {
  //   console.log("canvas created");
  //   // if (e?.selected?.length) {
  //   //   const { id, actorType } = e.selected[0];
  //   //   store.dispatch("selectObject", { id, actorType });
  //   // } else {
  //   //   console.warn("selection:created event couldnt find a target", e);
  //   // }
  // });

  // canvas.on({
  //   "selection:updated": (e) => {
  //     if (e?.selected) {
  //       e.selected.forEach(({ id, actorType }) => {
  //         store.dispatch("selectObject", { id, actorType });
  //       });
  //     } else {
  //       console.warn("selection:updated event couldnt find a target", e);
  //     }
  //   },
  //   "selection:created": (e) => {
  //     if (e?.selected) {
  //       e.selected.forEach(({ id, actorType }) => {
  //         store.dispatch("selectObject", { id, actorType });
  //       });
  //     } else {
  //       console.warn("selection:created event couldnt find a target", e);
  //     }
  //   },
  //   "selection:cleared": (e) => {
  //     if (e?.deselected?.length) {
  //       store.dispatch("selectObject", e.deselected[0]);
  //     } else if (e.target) {
  //       store.dispatch("selectObject", e.target);
  //     } else {
  //       console.warn("selection:cleared event couldnt find a target", e);
  //     }
  //   },
  // });
  // canvas.on("selection:updated", (e) => {
  //   // console.log("canvas updated");
  //   // if (e?.selected?.length) {
  //   //   store.dispatch("selectObject", e.selected[0]);
  //   // } else {
  //   //   console.warn("selection:updated event couldnt find a target", e);
  //   // }
  // });

  // canvas.on("selection:cleared", (e) => {
  //   console.log("canvas cleared");
  //   // if (e?.deselected?.length) {
  //   //   store.dispatch("selectObject", e.deselected[0]);
  //   // } else if (e.target) {
  //   //   store.dispatch("selectObject", e.target);
  //   // } else {
  //   //   console.warn("selection:cleared event couldnt find a target", e);
  //   // }
  // });

  fabric.Object.prototype.toObject = (function (toObject) {
    return function (propertiesToInclude) {
      propertiesToInclude = (propertiesToInclude || []).concat([
        "id",
        "actorType",
      ]);
      return toObject.apply(this, [propertiesToInclude]);
    };
  })(fabric.Object.prototype.toObject);

  return canvas;
}

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
    points.push({ x, y });
    angle += sweep;
  }
  return points;
}

function getNextUnusedSpace(canvas, top, left, obj) {
  if (top > canvas.height - 50) {
    return getNextUnusedSpace(canvas, 50, left + 75, obj);
  } else {
    let match = null;
    const list = canvas.getObjects();
    for (let i = 0; i < list.length; i++) {
      const el = list[i];
      if (
        el.left >= left &&
        el.left < obj.width + left &&
        el.top >= top &&
        el.top < obj.height + top
      ) {
        match = el;
        break;
      }
    }
    if (match) {
      return getNextUnusedSpace(canvas, top + match.height, left, obj);
    } else {
      return { top, left };
    }
  }
}

function removeIfExists(canvas, id) {
  const list = canvas.getObjects();

  const match = list.find((x) => x.id === id);
  if (match) {
    canvas.remove(match);
    return { top: match.top, left: match.left };
  } else {
    return null;
  }
}

function wrapCanvasText(t, canvas, maxW, maxH) {
  //Adapted from http://www.maxenko.com/wrapping-text-for-fabric-js/
  maxH || (maxH = 0);
  const words = t.text.split(" ");
  let formatted = "";

  // clear newlines
  const sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
  // calc line height
  const lineHeight = new fabric.Text(sansBreaks, {
    fontFamily: t.fontFamily,
    fontSize: t.fontSize,
  }).height;

  const maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
  const context = canvas.getContext("2d");

  context.font = t.fontSize + "px " + t.fontFamily;
  let currentLine = "";
  let breakLineCount = 0;

  let n = 0;
  while (n < words.length) {
    const isNewLine = currentLine === "";
    const testOverlap = currentLine + " " + words[n];

    const w = context.measureText(testOverlap).width;

    if (w < maxW) {
      if (currentLine != "") currentLine += " ";
      currentLine += words[n];
    } else {
      // if this hits, we got a word that need to be hypenated
      if (isNewLine) {
        let wordOverlap = "";

        // test word length until its over maxW
        for (let i = 0; i < words[n].length; ++i) {
          wordOverlap += words[n].charAt(i);
          let withHypen = wordOverlap + "-";

          if (context.measureText(withHypen).width >= maxW) {
            // add hyphen when splitting a word
            withHypen = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
            // update current word with remainder
            words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
            formatted += withHypen; // add hypenated word
            break;
          }
        }
      }
      while (
        t.textAlign === "right" &&
        context.measureText(" " + currentLine).width < maxW
      )
        currentLine = " " + currentLine;

      while (
        t.textAlign === "center" &&
        context.measureText(" " + currentLine + " ").width < maxW
      )
        currentLine = " " + currentLine + " ";

      formatted += currentLine + "\n";
      breakLineCount++;
      currentLine = "";

      continue; // restart cycle
    }
    if (maxHAdjusted > 0 && breakLineCount * lineHeight > maxHAdjusted) {
      // add ... at the end indicating text was cutoff
      formatted = formatted.substr(0, formatted.length - 3) + "...\n";
      currentLine = "";
      break;
    }
    n++;
  }

  if (currentLine !== "") {
    while (
      t.textAlign === "right" &&
      context.measureText(" " + currentLine).width < maxW
    )
      currentLine = " " + currentLine;

    while (
      t.textAlign === "center" &&
      context.measureText(" " + currentLine + " ").width < maxW
    )
      currentLine = " " + currentLine + " ";

    formatted += currentLine + "\n";
    breakLineCount++;
    currentLine = "";
  }

  // get rid of empy newline at the end
  formatted = formatted.substr(0, formatted.length - 1);

  return new fabric.Text(formatted, {
    left: t.left,
    top: t.top,
    fill: t.fill,
    fontFamily: t.fontFamily,
    fontSize: t.fontSize,
    originX: t.originX,
    originY: t.originY,
    angle: t.angle,
    shadow: t.shadow,
    textAlign: t.textAlign,
  });
}

function addGroup(canvas, group, data) {
  const { top, left } = getNextUnusedSpace(canvas, 50, 0, group);
  group.top = data ? data.top : top;
  group.left = data ? data.left : left;

  canvas.add(group);
}

function loadImage(src, opts) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(
      src,
      (img) => {
        resolve(img);
      },
      opts
    );
  });
}

export {
  initCanvas,
  addGroup,
  makeStar,
  removeIfExists,
  wrapCanvasText,
  loadImage,
  fontSize,
};
