function unvue(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function roll(dieSize) {
  return Math.floor(Math.random() * dieSize);
}

export {
  unvue,
  roll
};