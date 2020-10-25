import {v4 as uuid} from 'uuid';
import store from '../vuex-state/store';

class Scene {
  constructor(data) {
    this.green = data.green || [];
    this.yellow = data.yellow || [];
    this.red = data.red || [];
    this.challenges = (data.challenges || []).map(x => new Challenge(x));
    this.locations = (data.locations || []).map(x => new Location(x));
    this.name = data.name || '';
    this.acted = data.acted || false;
    this.notes = data.notes || '';
  }

  get isEmpty() {
    return this.green.length === 0 &&
      this.yellow.length === 0 &&
      this.red.length === 0;
  }

  create(green, yellow, red, name) {
    this.clear();

    for (let i = 0; i < green; i++) {
      this.green.push({checked: false});
    }
    for (let i = 0; i < yellow; i++) {
      this.yellow.push({checked: false});
    }
    for (let i = 0; i < red; i++) {
      this.red.push({checked: false});
    }
    this.name = name;
    this.save();
  }
  clear() {
    this.green = [];
    this.yellow = [];
    this.red = [];
    this.acted = false;
    this.name = '';
    this.challenges = [];
    this.locations = [];
    this.notes = '';
    this.save();
  }
  progressScene(element) {
    element.checked = !element.checked;
    this.save();
  }
  addLocation(location) {
    this.locations.push(new Location(location));
    this.save();
  }
  removeLocation(index) {
    if (index >= 0) {
      this.locations.splice(index, 1);
      this.save();
    }
  }
  resetLocations() {
    this.locations = [];
    store.dispatch('saveData', 'scene');
  }
  addChallenge(challenge) {
    console.log(challenge);
    this.challenges.push(new Challenge(challenge));
    this.save();
  }
  removeChallenge(index) {
    if (index >= 0) {
      this.challenges.splice(index, 1);
      store.dispatch('saveData', 'scene');
    }
  }
  resetChallenges() {
    this.challenges = [];
    store.dispatch('saveData', 'scene');
  }
  setNote(note) {
    this.notes = note;
    this.save();
  }
  save() {
    store.dispatch('saveData', 'scene');
  }
}

class Challenge {
  constructor(data) {
    this.name = data.name || '';
    this.id = data.id || uuid();
    this.list = (data.list || []).map(x => new ChallengeEntry(x));
    if (this.list.length === 0) {
      this.add({ label: `Complete ${this.name}` });
    }
  }

  add(data) {
    if (!data.label) return;
    this.list.push(new ChallengeEntry(data));
    this.save();
  }
  remove(index) {
    if (index >= 0) {
      this.list.splice(index, 1);
      this.save();
    }
  }
  save() {
    store.dispatch('saveData', 'scene');
  }
}

class ChallengeEntry {
  constructor(data) {
    this.completed = data.completed || false;
    this.editing = data.editing || false;
    this.label = data.label || '';
    this.tempLabel = data.label || data.tempLabel || '';
  }

  complete() {
    this.completed = !this.completed;
    this.save();
  }
  beginEdit() {
    this.editing = true;
  }
  edit() {
    this.editing = false;
    this.label = this.tempLabel;
    this.save();
  }
  cancel() {
    this.editing = false;
  }
  save() {
    store.dispatch('saveData', 'scene');
  }
}

class Location {
  constructor(data) {
    this.editing = data.editing || false;
    this.name = data.name || '';
    this.description = data.description || '';
    this.tempName = data.tempName || data.name || '';
    this.tempDescription = data.tempDescription || data.description || '';
    this.id = data.id || uuid();
  }

  beginEdit() {
    this.editing = true; 
  }
  edit() {
    this.editing = false;
    this.name = this.tempName;
    this.description = this.tempDescription;
    this.save();
  }
  save() {
    store.dispatch('saveData', 'scene');
  }
}

export default Scene;
export {Scene, Challenge, Location};