import Vue from 'vue';
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
    this.id = data.id || uuid();
    this.type = data.type || 'environment';
  }

  get isEmpty() {
    return this.green.length === 0 &&
      this.yellow.length === 0 &&
      this.red.length === 0;
  }
  get list () {
    return [this];
  }
  get typeLabel() {
    return this.type;
  }
  get allowAddMinion() {
    return true;
  }

  takenAction() {
    const minions = store.getters.childMinions(this.id);
    const newStatus = !this.acted;
    const minionNotMatched = minions.some(minion => {
      const match = minion.list.find(x => x.acted !== newStatus);
      return !!match;
    });
    const message = newStatus ? 
      `Some of the environment's minions have not acted. Do you also want to mark all of it's minions as having acted too?`:
      `Some of the environment's minions have already acted. Do you also want to mark it's minions as having not acted?`;
    if (minionNotMatched && minions.length > 0) {
      Vue.dialog.confirm({
        title: 'Warning',
        body: message
      },
      {
        okText: 'Yes',
        cancelText: 'No'
      })
      .then(() => {
        minions.forEach(minion => {
          minion.takenAction(null, newStatus);
        })
      });
    }
    this.acted = newStatus;
    this.save();
  }
  resetRound() {
    this.acted = false;
    this.save();
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
  addChallenge(challenge, skipInitialize) {
    this.challenges.push(new Challenge(challenge, skipInitialize));
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
  export() {
    return {
      scene: [{
        id: this.id,
        name: this.name,
        acted: this.acted,
        notes: this.notes,
        green: this.exportSceneTracker(this.green),
        yellow: this.exportSceneTracker(this.yellow),
        red: this.exportSceneTracker(this.red),
        type: 'scene'
      }],
      locations: this.locations.map(x => x.export()),
      challenges: this.exportChallenges(),
    }
  }
  exportSceneTracker(arr) {
    const completed = arr.filter(x => x.checked).length;
    return `${completed}-${arr.length}`;
  }
  exportChallenges() {
    return this.challenges.reduce((acc, el) => {
      acc.push(el.export());
      el.list.forEach(x => {
        acc.push(x.export(el.id));
      });
      return acc;
    }, []);
  }
  import(data) {
    const greens = data.green.split('-');
    const yellows = data.yellow.split('-');
    const reds = data.red.split('-');
    this.create(Number(greens[1]), Number(yellows[1]), Number(reds[1]), data.name || 'Default Environment');
    for (let i = 0; i < Number(greens[0]); i++) {
      this.progressScene(this.green[i]);
    }
    for (let i = 0; i < Number(yellows[0]); i++) {
      this.progressScene(this.yellow[i]);
    }
    for (let i = 0; i < Number(reds[0]); i++) {
      this.progressScene(this.red[i]);
    }
    this.acted = data.acted || false;
    this.notes = data.notes || '';
    this.id = data.id || this.id;
  }
}

class Challenge {
  constructor(data, skipInitialize) {
    this.name = data.name || '';
    this.id = data.id || uuid();
    this.list = (data.list || []).map(x => new ChallengeEntry(x));
    if (!skipInitialize) this.initialize();
  }
  
  initialize() {
    if (this.list.length === 0) {
      this.add({ label: `Complete ${this.name}` });
    }
  }
  add(data) {
    if (!data.label && !data.name) return;
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
  export() {
    return {
      id: this.id,
      name: this.name,
      type: 'challenge'
    }
  }
}

class ChallengeEntry {
  constructor(data) {
    this.completed = data.completed || false;
    this.editing = data.editing || false;
    this.label = data.label || data.name || '';
    this.tempLabel = data.label || data.tempLabel || '';
    this.id = data.id || uuid();
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
  export(parent) {
    return {
      name: this.label,
      parent,
      completed: this.completed,
      type: 'challenge element'
    }
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
    store.dispatch('saveData ', 'scene');
  }
  export() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'location'
    }
  }
}

export default Scene;
export {Scene, Challenge, Location};