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
    this.bonuses = data.bonuses || [];
    this.penalties = data.penalties || [];
    this.defends = data.defends || [];
    this.groupId = data.groupId || uuid();
    this.acted = data.acted || false;
    this._count = data.count || data._count || 1;
    
    // if (data.types) {
    //   Object.entries(data.types).forEach(([size, baddieData]) => {
    //     baddieData.forEach(x => this.addBaddie(x, size));
    //   });
    // } else if (data.list) {
    //   this.list = data.list;
    // } else if (!data.leaveEmptyList) {
    //   this.addBaddie({size: data.size, count: data.count});
    // }
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
    const copy = unvue(this); //todo: export?
    copy.id = uuid();
    copy.size = this.size - 2;
    copy.count = 1;
    if (copy.size >= 4) {
      this.count--;
      store.dispatch('upsertBaddie', copy);
    }
  }
  promote() {
    if (this.size >= 12) {
      return;
    } else {
      const copy = unvue(this); //todo: export?
      copy.id = uuid();
      copy.size = this.size + 2;
      copy.count = 1;
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
      //todo: only remove it from one of these.
      // this[type].splice(index, 1);
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
      const list = [];
      let modifiersList = [];
      this.list.forEach(x => {
        const {baddie, modifiers} = this.exportBaddie(x);
        list.push(baddie);
        modifiersList = modifiersList.concat(modifiers);
      });
  
      return {
        baddie: {
          id: this.id,
          owner: this._owner,
          name: this.name,
          type: this.type,
        },
        list,
        modifiers: modifiersList
      }
    } else return {};
  }
  exportBaddie(baddieData) {
    const id = baddieData.id || uuid();
    return {
      baddie: {
        id,
        acted: baddieData.acted,
        count: baddieData.count,
        size: baddieData.size,
        parent: this.id,
        type: `${this.type} element`
      },
      modifiers: [
        ...baddieData.bonuses.map(x => exportModifier(x, id, 'bonus')),
        ...baddieData.defends.map(x => exportModifier(x, id, 'penalty')),
        ...baddieData.penalties.map(x => exportModifier(x, id, 'defend'))
      ]
    }
  }
}

class Villain {
  constructor(data) {
    this.name = data.name;
    this.acted = data.acted || false;
    this.bonuses = data.bonuses || [];
    this.penalties = data.penalties || [];
    this.defends = data.defends || [];
    this.type = 'villains';
    this.id = data.id || uuid();
  }

  get list() {
    return [this];
  }
  get allowAddMinion() {
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