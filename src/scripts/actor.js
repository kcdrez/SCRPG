import {v4 as uuid} from 'uuid';
import store from '../vuex-state/store';

class Actor {
  constructor(data) {
    if (this.constructor === Actor) {
      throw new TypeError('Abstract class "Actor" cannot be instantiated directly.')
    }
    this.id = data.id || uuid();
    this.name = data.name;
    this.tempName = data.tempName || data.name || '';
    this.acted = data.acted || false;
    this.editing = data.editing || false;
    this.type = data.type;
  }

  get typeLabel() {
    switch (this.type) {
      case 'minions':
        return 'minion';
      case 'lieutenants':
        return 'lieutenant';
      default:
        return this.type;
    }
  }

  save() {
    store.dispatch('saveData', this.type);
  }
  beginEdit() {
    this.editing = true;
  }
  cancelEdit() {
    this.editing = false;
  }
  resetRound() {
    this.acted = false;
    this.save();
  }
  takenAction() {
    this.acted = !this.acted;
    this.save();
  }
  saveEdit() {
    this.editing = false;
    this.name = this.tempName;
    this.save();
  }
}

export default Actor;