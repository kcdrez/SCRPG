import { v4 as uuid } from 'uuid';
import store from '../vuex-state/store';


class GenericObject {
  constructor(data) {
    if (this.constructor === GenericObject) {
      throw new TypeError('Abstract class "GenericObject" cannot be instantiated directly.')
    }
    this.id = data.id || uuid();
    this.name = data.name;
    this.tempName = data.tempName || data.name || '';
    this.editing = data.editing || false;
    this.type = data.type;
    this.top = data.top || null;
    this.left = data.left || null;
  }

  save(type, data) {
    store.dispatch('saveData', { type: type || this.type, data });
  }
  beginEdit() {
    this.editing = true;
  }
  cancelEdit() {
    this.editing = false;
  }
  saveEdit() {
    this.editing = false;
    this.name = this.tempName;
    this.save();
  }
}

class Actor extends GenericObject {
  constructor(data) {
    super(data);
    if (this.constructor === Actor) {
      throw new TypeError('Abstract class "Actor" cannot be instantiated directly.')
    }
    this.acted = data.acted || false;
  }

  get typeLabel() {
    switch (this.type) {
      case 'minions':
        return 'minion';
      case 'lieutenants':
        return 'lieutenant';
      case 'villains':
        return 'villain';
      default:
        return this.type;
    }
  }

  resetRound() {
    this.acted = false;
    this.save();
  }
  takenAction() {
    this.acted = !this.acted;
    this.save();
  }
  sortModifiers(list) {
    list.sort((a, b) => {
      if (a.name !== b.name) {
        return a.name > b.name ? 1: -1;
      } else if (a.amount !== b.amount) {
        return a.amount > b.amount ? 1: -1;
      } else if (a.persistent !== b.persistent) {
        return a.persistent ? -1: 1;
      } else if (a.exclusive !== b.exclusive) {
        return a.exclusive ? -1: 1;
      } else {
        return 0;
      }
    });
    this.save();
  }
}

function sortActors(a, b) {
  if (a.type > b.type) return 1;
  else if (b.type > a.type) return -1;
  else if (a.name > b.name) return 1;
  else if (b.name > a.name) return -1;
  else if (a.size > b.size) return 1;
  else if (b.size > a.size) return -1;
  else if (a.bonuses.length > b.bonuses.length) return -1;
  else if (b.bonuses.length > b.bonuses.length) return 1;
  else if (a.penalties.length > b.penalties.length) return -1;
  else if (b.penalties.length > b.penalties.length) return 1;
  else if (a.defends.length > b.defends.length) return -1;
  else if (b.defends.length > b.defends.length) return 1;
  else if (a.count > b.count) return -1;
  else if (b.count > a.count) return 1;
  else return 0;
}

export default Actor;
export { Actor, GenericObject, sortActors };