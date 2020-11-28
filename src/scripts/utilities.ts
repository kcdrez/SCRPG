function unvue(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function roll(dieSize: number) {
  return Math.floor(Math.random() * dieSize);
}

export {
  unvue,
  roll
};