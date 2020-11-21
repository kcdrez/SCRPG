import Vue from 'vue';
import store from '../vuex-state/store';
import {unvue} from './utilities';
import {v4 as uuid} from 'uuid';

class Baddie {
  constructor(data) {
    this.name = data.name || '';
    this.type = data.type || 'minions';
    this._owner = data.owner || data._owner || null;
    this.id = data.id || uuid();
    this.size = data.size || 12;
    this.bonuses = data.bonuses ? data.bonuses.map(x => new Modifier(x)) : [];
    this.penalties = data.penalties ? data.penalties.map(x => new Modifier(x)) : [];
    this.defends = data.defends ? data.defends.map(x => new Modifier(x)) : [];
    this.acted = data.acted || false;
    this._count = data.count || data._count || 1;
  }

  get owner() {
    return store.getters.byID(this._owner);
  }
  get typeLabel() {
    switch (this.type) {
      case 'minions':
      default:
        return 'minion';
      case 'lieutenants':
        return 'lieutenant';
    }
  }
  get count() { return this._count; }
  set count(val) {
    this._count = val;
    this.save();
  }

  findChild(id) {
    return this.list.find(x => x.id === id);
  }
  demote() {
    const copy = this.copy();
    copy.id = uuid();
    copy.size = this.size - 2;
    copy.count = 1;
    if (copy.size >= 4) {
      this.count--;
      store.dispatch('upsertBaddie', copy);
    }
  }
  promote() {
    const copy = this.copy();
    copy.id = uuid();
    copy.size = this.size + 2;
    copy.count = 1;
    if (copy.size <= 12) {
      this.count--;
      store.dispatch('upsertBaddie', copy);
    }
  }
  addModifier(modifierData) {
    if (!modifierData.name) return;

    switch (modifierData.type.toLowerCase()) {
      case 'bonus':
        this.bonuses.push(new Modifier(modifierData));
        break;
      case 'penalty':
        this.penalties.push(new Modifier(modifierData));
        break;
      case 'defend':
        this.defends.push(new Modifier(modifierData));
        break;
    }
    this.save();
  }
  removeModifier(type, index) {
    const remove = () => {
      const copy = this.copy();
      copy[type].splice(index, 1);
      this.count--;
      console.log(copy);
      store.dispatch('upsertBaddie', copy);
      this.save();
    }

    if (this[type][index].exclusive || this[type][index].persistent) {
      Vue.dialog.confirm({
        title: 'Are you sure?',
        body: `This ${type} is persistent and/or exclusive. Are you sure you want to remove it?`
      },
      {
        okText: 'Yes',
        cancelText: 'No'
      })
      .then(() => {
        remove();
      });
    } else { 
      remove();
    }
  }
  takenAction(status) {
    this.acted = status === undefined ? !this.acted : status;
    this.save();
  }
  resetRound() {
    this.acted = false;
    this.save();
  }
  save() {
    if (this.count <= 0) {
      store.dispatch('removeBaddie', {type: this.type, id: this.id});
    } else {
      store.dispatch('saveData', this.type);
    }
  }
  export(id) {
    if (!id || this.id === id) {
      const modifiersList = [
        ...this.bonuses.map(x => x.export(this.id)),
        ...this.penalties.map(x => x.export(this.id)),
        ...this.defends.map(x => x.export(this.id)),
      ];
  
      return {
        baddie: {
          name: this.name,
          type: this.type,
          owner: this._owner,
          id: this.id,
          size: this.size,
          acted: this.acted,
          _count: this.count
        },
        modifiers: modifiersList
      }
    } else return {};
  }
  copy() {
    return Object.assign({
      bonuses: this.bonuses.map(x => x.export(this.id)),
      penalties: this.penalties.map(x => x.export(this.id)),
      defends: this.defends.map(x => x.export(this.id)),
    }, this.export().baddie);
  }
}

class Villain {
  constructor(data) {
    this.name = data.name;
    this.tempName = data.tempName || data.name || '';
    this.acted = data.acted || false;
    this.bonuses = data.bonuses ? data.bonuses.map(x => new Modifier(x)) : [];
    this.penalties = data.penalties ? data.penalties.map(x => new Modifier(x)) : [];
    this.defends = data.defends ? data.defends.map(x => new Modifier(x)) : [];
    this.type = 'villains';
    this.id = data.id || uuid();
    this.editing = data.editing || false;
  }

  get allowAddMinion() {
    return true;
  }
  get typeLabel() {
    return 'villain';
  }
  get allowEdit() {
    return true;
  }

  boost(name, amount, persistent, exclusive) {
    this.bonuses.push({name, amount, persistent, exclusive});
    this.bonuses.sort((a, b) => {
      if (a.name !== b.name) {
        return a.name > b.name ? 1: -1;
      } else if (a.amount !== b.amount) {
        return a.amount > b.amount ? -1: 1;
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
  hinder(name, amount, persistent, exclusive) {
    this.penalties.push({name, amount, persistent, exclusive});
    this.penalties.sort((a, b) => {
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
  defend(name, amount) {
    this.defends.push({name, amount});
    this.defends.sort((a, b) => {
      if (a.name !== b.name) {
        return a.name > b.name ? 1: -1;
      } else if (a.amount !== b.amount) {
        return a.amount > b.amount ? -1: 1;
      } else {
        return 0;
      }
    });
    this.save();
  }
  addModifier({name, type, amount, persistent, exclusive}) {
    if (name === '') return;
    switch (type.toLowerCase()) {
      case 'bonus':
        this.boost(name, amount, persistent, exclusive);
        break;
      case 'penalty':
        this.hinder(name, amount, persistent, exclusive);
        break;
      case 'defend':
        this.defend(name, amount);
        break;
    }
  }
  removeModifier(type, index) {
    const remove = () => {
      this[type].splice(index, 1);
      this.save();
    }
    if (this[type][index].exclusive || this[type][index].persistent) {
      Vue.dialog.confirm(`This ${type} is persistent and/or exclusive. Are you sure you want to remove it?`)
      .then(() => {
        remove();
      });
    } else { 
      remove();
    }
  }
  takenAction() {
    const minions = store.getters.childMinions(this.id); 
    const newStatus = !this.acted;
    const minionNotMatched = minions.some(minion => {
      const match = minion.list.find(x => x.acted !== newStatus);
      return !!match;
    });
    const message = newStatus ? 
      `Some of this villain's minions have not acted. Generally, all minions act at the start of the turn. Do you also want to mark all of their minions as having acted too?`:
      `Some of this villain's minions have already acted. Do you also want to mark their minions as having not acted?`;
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
  save() {
    store.dispatch('saveData', this.type);
  }
  export() {
    const minions = store.getters.childMinions(this.id).reduce((acc, minion) => {
      const {baddie, list, modifiers} = minion.export();
      acc.push(baddie);
      acc.push(...list);
      acc.push(...modifiers);
      return acc;
    }, []);

    return {
      baddie: {
        id: this.id,
        name: this.name,
        type: this.type,
        acted: this.acted
      },
      modifiers: [
        ...this.bonuses.map(x => exportModifier(x, this.id, 'bonus')),
        ...this.defends.map(x => exportModifier(x, this.id, 'penalty')),
        ...this.penalties.map(x => exportModifier(x, this.id, 'defend'))
      ],
      list: minions
    }
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

class Modifier {
  constructor(data) {
    this.id = data.id || uuid();
    this.name = data.name;
    this.amount = data.amount;
    this.exclusive = data.exclusive || false;
    this.persistent = data.persistent || false;
    this.type = data.type;
  }

  export(parent) {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      amount: this.amount,
      exclusive: this.exclusive,
      persistent: this.persistent,
      parent
    }
  }
}

function exportModifier(modifier, parent, type) { //todo kill this
  return {
    name: modifier.name,
    amount: modifier.amount,
    exclusive: modifier.exclusive,
    persistent: modifier.persistent,
    parent,
    type
  }
}

function sameBaddies(baddie1, baddie2) {
  return baddie1.name === baddie2.name &&
    JSON.stringify(baddie1.bonuses) === JSON.stringify(baddie2.bonuses) &&
    JSON.stringify(baddie1.penalties) === JSON.stringify(baddie2.penalties) &&
    JSON.stringify(baddie1.defends) === JSON.stringify(baddie2.defends);
}

export {Baddie, Villain, sameBaddies};