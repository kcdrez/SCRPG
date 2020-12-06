import Vue from 'vue';
import {v4 as uuid} from 'uuid';
import store from '../vuex-state/store';
import { Actor, GenericObject } from './actor';

class Scene extends Actor {
  constructor(data) {
    super(data);
    this.green = data.green || [];
    this.yellow = data.yellow || [];
    this.red = data.red || [];
    this.challenges = (data.challenges || []).map(x => new Challenge(x));
    this.locations = (data.locations || []).map(x => new Location(x));
    this.notes = data.notes || '';
  }

  get isEmpty() {
    return this.green.length === 0 &&
      this.yellow.length === 0 &&
      this.red.length === 0;
  }
  get allowAddMinion() {
    return true;
  }

  takenAction() {
    const minions = store.getters.childMinions(this.id);
    const newStatus = !this.acted;
    const minionNotMatched = minions.some(x => x.acted !== newStatus);
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
          minion.takenAction(newStatus);
        })
      });
    }
    this.acted = newStatus;
    this.save();
  }
  create(green, yellow, red, name) {
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
    const clearScene = () => {
      minions.forEach(minion => store.dispatch('removeBaddie', {id: minion.id, type: minion.type}));
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

    const minions = store.getters.childMinions(this.id);
    if (minions.length > 0) {
      Vue.dialog.confirm({
        title: 'Warning',
        body: 'Clearing the scene will remove all the environment\'s minions. Do you want to continue?'
      },
      {
        okText: 'Yes',
        cancelText: 'No'
      })
      .then(() => {
        clearScene();
      });
    } else {
      clearScene();
    }
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
    this.save();
  }
  addChallenge(challenge, skipInitialize) {
    this.challenges.push(new Challenge(challenge, skipInitialize));
    this.save();
  }
  removeChallenge(index) {
    if (index >= 0) {
      this.challenges.splice(index, 1);
      this.save();
    }
  }
  resetChallenges() {
    this.challenges = [];
    this.save();
  }
  setNote(note) {
    this.notes = note;
    this.save();
  }
  export(challengeId) {
    const minions = store.getters.childMinions(this.id).reduce((acc, minion) => {
      const {baddie, modifiers} = minion.export();
      acc.push(baddie);
      acc.push(...modifiers);
      return acc;
    }, []);

    return {
      scene: this.name ? {
        id: this.id,
        name: this.name,
        acted: this.acted,
        notes: this.notes,
        green: this.exportSceneTracker(this.green),
        yellow: this.exportSceneTracker(this.yellow),
        red: this.exportSceneTracker(this.red),
        type: 'scene'
      } : null,
      locations: this.locations.map(x => x.export()),
      challenges: this.exportChallenges(challengeId),
      envMinions: minions
    }
  }
  exportSceneTracker(arr) {
    const completed = arr.filter(x => x.checked).length;
    return `${completed}-${arr.length}`;
  }
  exportChallenges(id) {
    return this.challenges.reduce((acc, el) => {
      if (!id || el.id === id) {
        acc.push(el.export());
        el.list.forEach(x => {
          acc.push(x.export(el.id));
        });
      }
      return acc;
    }, []);
  }
  import(data) {
    this.clear();
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

class Challenge extends GenericObject {
  constructor(data, skipInitialize) {
    super(data);
    this.list = (data.list || []).map(x => new ChallengeEntry(x));
    this.description = data.description || '';
    this.tempDescription = data.tempDescription || this.description;
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
      if (this.list.length === 0) {
        Vue.dialog.confirm({
          title: 'No Challenges',
          body: 'This Challenge has no elements. Do you want to remove it?'
        },
        {
          okText: 'Yes',
          cancelText: 'No'
        })
        .then(() => {
          const thisIndex = store.state.scene.challenges.findIndex(x => x.id === this.id);
          store.state.scene.removeChallenge(thisIndex);
        });
      }
    }
  }
  save() {
    store.dispatch('saveData', 'scene');
  }
  saveEdit() {
    this.description = this.tempDescription;
    super.saveEdit();
  }
  export() {
    return {
      id: this.id,
      name: this.name,
      type: 'challenge',
      description: this.description
    }
  }
}

class ChallengeEntry extends GenericObject {
  constructor(data) {
    super(data);
    this.completed = data.completed || false;
  }

  complete() {
    this.completed = !this.completed;
    this.save();
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