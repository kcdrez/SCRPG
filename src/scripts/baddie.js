import Vue from 'vue';
import store from '../vuex-state/store';
import {v4 as uuid} from 'uuid';
import Actor from './actor';

class Baddie extends Actor {
  constructor(data) {
    super(data);
    this._owner = data.owner || data._owner || data.parent || null;
    this.tempOwner = this._owner;
    this.size = data.size || 12;
    this.tempSize = this.size;
    this.bonuses = data.bonuses ? data.bonuses.map(x => new Modifier(x)) : [];
    this.penalties = data.penalties ? data.penalties.map(x => new Modifier(x)) : [];
    this.defends = data.defends ? data.defends.map(x => new Modifier(x)) : [];
    this.markForDeath = false;
    this.instances = data.instances || [];
    this.tempCount = this.count;

    if (data.count > 0) {
      this.addInstances(data.count);
    } else if (this.count === 0) {
      this.addInstances(1);
    }
  }

  get owner() {
    return store.getters.byID(this._owner);
  }
  get count() { return this.instances.length; }
  set count(val) {
    const diff = val - this.count;
    if (diff > 0) {
      this.addInstances(diff);
    } else {
      this.removeInstance(null, Math.abs(diff));
    }
    this.tempCount = val;
    this.save();
  }
  get allowEdit() {
    return !this.editing;
  }
  get viewDetails() {
    return true;
  }

  demote(id) {
    const copy = this.copy(true);
    copy.id = uuid();
    copy.size = this.size - 2;
    copy.count = 1;
    if (copy.size >= 4) {
      if (id) {
        this.removeInstance(id);
      } else {
        this.count--;
      }
      store.dispatch('upsertBaddie', copy);
    }
  }
  promote(id) {
    const copy = this.copy(true);
    copy.id = uuid();
    copy.size = this.size + 2;
    copy.count = 1;
    if (copy.size <= 12) {
      if (id) {
        this.removeInstance(id);
      } else {
        this.count--;
      }
      store.dispatch('upsertBaddie', copy);
    }
  }
  addModifier(modifierData) {
    if (!modifierData.name) return;

    switch (modifierData.type.toLowerCase()) {
      case 'bonus':
        this.bonuses.push(new Modifier(modifierData));
        this.sortModifiers(this.bonuses);
        break;
      case 'penalty':
        this.penalties.push(new Modifier(modifierData));
        this.sortModifiers(this.penalties);
        break;
      case 'defend':
        this.defends.push(new Modifier(modifierData));
        this.sortModifiers(this.defends);
        break;
    }
  }
  removeModifier(type, index) {
    const remove = () => {
      const copy = this.copy(true);
      copy[type].splice(index, 1);
      copy.id = uuid();
      copy.count = 1;
      this.count--;
      if (copy.count > 0) store.dispatch('upsertBaddie', copy);
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
  save() {
    if (this.count <= 0) {
      store.dispatch('removeBaddie', {type: this.type, id: this.id});
    } else {
      store.dispatch('reconcile', this.type);
    }
  }
  export(id, excludeInstances) {
    if (!id || this.id === id) {
      const modifiers = [
        ...this.bonuses.map(x => x.export(this.id)),
        ...this.penalties.map(x => x.export(this.id)),
        ...this.defends.map(x => x.export(this.id)),
      ];

      const baddie = {
        name: this.name,
        type: this.type,
        parent: this._owner,
        id: this.id,
        size: this.size,
        acted: this.acted,
        count: this.count,
        top: this.top,
        left: this.left
      };

      if (!excludeInstances) {
        baddie.instances = this.instances;
      }
  
      return {
        baddie,
        modifiers
      }
    } else return {};
  }
  copy(excludeInstances) {
    return Object.assign({
      bonuses: this.bonuses.map(x => x.export(this.id)),
      penalties: this.penalties.map(x => x.export(this.id)),
      defends: this.defends.map(x => x.export(this.id)),
    }, this.export(null, excludeInstances).baddie);
  }
  saveEdit() {
    this._owner = this.tempOwner;
    this.size = this.tempSize;
    this.count = this.tempCount;
    this.bonuses.forEach(b => b.saveEdit());
    this.penalties.forEach(p => p.saveEdit());
    this.defends.forEach(d => d.saveEdit());
    super.saveEdit();
  }
  addInstances(amount) {
    for (let i = 1; i <= amount; i++) {
      this.instances.push({ id: uuid(), top: null, left: null });
    }
  }
  removeInstance(id, amount) {
    if (id) {
      const index = this.instances.findIndex(x => x.id === id);
      if (index > -1) {
        this.instances.splice(index, 1);
      }
    } else if (amount) {
      for (let i = 1; i <= amount; i++) {
        this.instances.pop();
      }
    }
    this.save();
  }
}

class Villain extends Actor{
  constructor(data) {
    super(data);
    this.bonuses = data.bonuses ? data.bonuses.map(x => new Modifier(x)) : [];
    this.penalties = data.penalties ? data.penalties.map(x => new Modifier(x)) : [];
    this.defends = data.defends ? data.defends.map(x => new Modifier(x)) : [];
  }

  get allowAddMinion() {
    return true;
  }
  get allowEdit() {
    return true;
  }
  get viewDetails() {
    return true;
  }

  addModifier(modifierData) {
    if (!modifierData.name) return;

    switch (modifierData.type.toLowerCase()) {
      case 'bonus':
        this.bonuses.push(new Modifier(modifierData));
        this.sortModifiers(this.bonuses);
        break;
      case 'penalty':
        this.penalties.push(new Modifier(modifierData));
        this.sortModifiers(this.penalties);
        break;
      case 'defend':
        this.defends.push(new Modifier(modifierData));
        this.sortModifiers(this.defends);
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
    const minionNotMatched = minions.some(x => x.acted !== newStatus);
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
          minion.takenAction(newStatus);
        })
      });
    }
    this.acted = newStatus;
    this.save();
  }
  export() {
    const minions = store.getters.childMinions(this.id).reduce((acc, minion) => {
      const {baddie, modifiers} = minion.export();
      acc.push(baddie);
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
        ...this.bonuses.map(x => x.export(this.id)),
        ...this.defends.map(x => x.export(this.id)),
        ...this.penalties.map(x => x.export(this.id))
      ],
      minions
    }
  }
  saveEdit() {
    this.bonuses.forEach(b => b.saveEdit());
    this.penalties.forEach(p => p.saveEdit());
    this.defends.forEach(d => d.saveEdit());
    super.saveEdit();
  }
  remove() {
    store.dispatch('removeBaddie', { id: this.id, type: this.type });
  }
}

class Modifier {
  constructor(data) {
    this.id = data.id || uuid();
    this.name = data.name;
    this.tempName = this.name;
    this.amount = data.amount;
    this.tempAmount = this.amount;
    this.exclusive = data.exclusive || false;
    this.tempExclusive = this.exclusive;
    this.persistent = data.persistent || false;
    this.tempPersistent = this.persistent;
    this.type = data.type;
  }

  get min() {
    switch (this.type.toLowerCase()) {
      case 'bonus':
        return 1;
      case 'hinder':
        return -4;
      case 'defend':
        return 100;
      default:
        console.warning('Unknown modifier type', this.type);
        return 100;
    }
  }
  get max() {
    switch (this.type.toLowerCase()) {
      case 'bonus':
        return 4;
      case 'hinder':
        return -1;
      case 'defend':
        return 1;
      default:
        console.warning('Unknown modifier type', this.type);
        return 1;
    }
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
  saveEdit() {
    this.name = this.tempName;
    this.amount = this.tempAmount;
    this.persistent = this.tempPersistent;
    this.exclusive = this.tempExclusive;
  }
}

function sameBaddies(baddie1, baddie2) {
  return baddie1.name === baddie2.name &&
    JSON.stringify(baddie1.bonuses) === JSON.stringify(baddie2.bonuses) &&
    JSON.stringify(baddie1.penalties) === JSON.stringify(baddie2.penalties) &&
    JSON.stringify(baddie1.defends) === JSON.stringify(baddie2.defends) &&
    baddie1.size === baddie2.size;
}

export {Baddie, Villain, sameBaddies};