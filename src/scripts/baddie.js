import Vue from 'vue';
import store from '../vuex-state/store';
import {unvue} from './utilities';
import {v4 as uuid} from 'uuid';

class Baddie {
  constructor(data, baddieType) {
    this.name = data.name || '';
    this.baddieType = baddieType; //todo: remove
    this.type = baddieType;
    this.list = [];
    this._owner = data.owner || data._owner;
    this.id = uuid();
    
    if (data.types) {
      Object.entries(data.types).forEach(([size, baddieData]) => {
        baddieData.forEach(x => this.addBaddie(x, size));
      });
    } else if (data.list) {
      this.list = data.list;
    } else {
      this.addBaddie({size: data.size, count: data.count});
    }
  }

  get owner() {
    return store.getters.byID(this._owner);
  }

  match(baddie, byIndex) {
    if (byIndex) {
      return this.list.findIndex(x => isSame(x));
    } else {
      return this.list.find(x => isSame(x));
    }

    function isSame({bonuses, penalties, defends, size}) {
      return JSON.stringify(bonuses) === JSON.stringify(baddie.bonuses) &&
        JSON.stringify(penalties) === JSON.stringify(baddie.penalties) &&
        JSON.stringify(defends) === JSON.stringify(baddie.defends) &&
        size === baddie.size; 
    }
  }
  demote(baddie) {
    const copy = unvue(baddie);
    copy.size = baddie.size - 2;
    copy.count = 1;
    if (copy.size >= 4) {
      this.addBaddie(copy);
      this.remove(baddie);
    }
  }
  promote(baddie) {
    if (baddie.size >= 12) {
      return;
    } else {
      const copy = unvue(baddie);
      copy.size = baddie.size + 2;
      copy.count = 1;
      this.addBaddie(copy);
      this.remove(baddie);
    }
  }
  addBaddie(baddie, size) {
    baddie.count = baddie.count || 1;
    baddie.acted = baddie.acted === undefined ? false: baddie.acted;
    baddie.size = size || baddie.size || 12;
    baddie.bonuses = baddie.bonuses || [];
    baddie.penalties = baddie.penalties || [];
    baddie.defends = baddie.defends || [];
    const match = this.match(baddie, false);
    if (match) {
      match.count += baddie.count;
    } else {
      this.list.push(baddie);
      this.refresh();
    }
  }
  remove(baddie, all) {
    if (baddie.count <= 1) {
      const index = this.match(baddie, true);
      if (index > -1) {
        this.list.splice(index, 1);
        this.refresh();
        if (this.list.length === 0) {
          store.commit('DELETE_BADDIE', {baddie: this, baddieType: this.baddieType});
        }
      }
    } else {
      const match = this.match(baddie);
      if (match) {
        if (all) match.count = 0;
        else match.count--;
        this.refresh();
      }
    }
  }
  boost(name, amount, persistent, exclusive, baddie, singleEntry) {
    const copy = unvue(baddie);
    copy.count = singleEntry ? 1 : copy.count;
    copy.bonuses.push({amount, name, persistent, exclusive});
    copy.bonuses.sort((a, b) => {
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
    this.addBaddie(copy);
    this.remove(baddie, !singleEntry);
    this.refresh();
  }
  hinder(name, amount, persistent, exclusive, baddie, singleEntry) {
    const copy = unvue(baddie);
    copy.count = singleEntry ? 1 : copy.count;
    copy.penalties.push({amount, name, persistent, exclusive});
    copy.penalties.sort((a, b) => {
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
    this.addBaddie(copy);
    this.remove(baddie, !singleEntry);
    this.refresh();
  }
  defend(name, amount, baddie, singleEntry) {
    const copy = unvue(baddie);
    copy.count = singleEntry ? 1 : copy.count;
    copy.defends.push({amount, name});
    copy.defends.sort((a, b) => {
      if (a.name !== b.name) {
        return a.name > b.name ? 1: -1;
      } else if (a.amount !== b.amount) {
        return a.amount > b.amount ? -1: 1;
      } else {
        return 0;
      }
    });
    this.addBaddie(copy);
    this.remove(baddie, !singleEntry);
    this.refresh();
  }
  countBySize(size) {
    return this.list.reduce((total, item) => {
      if (item.size === size) {
        return total + item.count;
      } else {
        return total;
      }
    }, 0);
  }
  refresh() {
    this.list = unvue(this.list).reduce((acc, el) => {
      const match = acc.find(x => {
        return JSON.stringify(x.bonuses) === JSON.stringify(el.bonuses) &&
          JSON.stringify(x.penalties) === JSON.stringify(el.penalties) &&
          JSON.stringify(x.defends) === JSON.stringify(el.defends) &&
          x.size === el.size;
      });
      if (match) {
        match.count += el.count;
      } else if (el.count > 0) {
        acc.push(el);
      }
      return acc;
    }, []).sort((a, b) => {
      if (a.size !== b.size) {
        return a.size > b.size ? -1: 1;
      } else if (a.bonuses.length !== b.bonuses.length) {
        return a.bonuses.length > b.bonuses.length ? -1: 1;
      } else if (a.penalties.length !== b.penalties.length) {
        return a.penalties.length > b.penalties.length ? -1: 1;
      } else if (a.defends.length !== b.defends.length) {
        return a.defends.length > b.defends.length ? -1: 1;
      } else {
        return 0;
      }
    });
    store.dispatch('saveBaddies', this.baddieType);
  }
  addModifier({name, type, amount, persistent, exclusive, applyTo}, baddie) {
    if (!name) return;

    const modify = (baddieItem) => {
      if (type === 'Bonus') {
        this.boost(name, amount, persistent, exclusive, baddieItem, applyTo === 'single');
      } else if (type === 'Penalty') {
        this.hinder(name, amount, persistent, exclusive, baddieItem, applyTo === 'single');
      } else if (type === 'Defend') {
        this.defend(name, amount, baddieItem, applyTo === 'single');
      }
    }
    if (applyTo === 'name') {
      this.list.forEach(x => {
        modify(x);
      });
    } else {
      modify(baddie);
    }
  }
  removeModifier(baddie, type, index) {
    const data = baddie[type];
    const remove = () => {
      if (baddie.count > 1) {
        const copy = unvue(baddie);
        copy.count = 1;
        copy[type].splice(index, 1);
        this.remove(baddie);
        this.addBaddie(copy);
      } else {
        baddie[type].splice(index, 1);
      }
      this.refresh();
    }
    if (data[index].exclusive || data[index].persistent) {
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
  takenAction(index, status) {
    if (index === null) {
      this.list.forEach(x => {
        x.acted = status === undefined ? !x.acted : status;
      });
    } else {
      this.list[index].acted = status === undefined ? !this.list[index].acted : status;
    }
    store.dispatch('saveBaddies', this.baddieType);
  }
  resetRound() {
    this.list.forEach(x => x.acted = false);
  }
}

class Villain {
  constructor(data) {
    this.name = data.name;
    this.acted = data.acted || false;
    this.bonuses = data.bonuses || [];
    this.penalties = data.penalties || [];
    this.defends = data.defends || [];
    this.baddieType = 'villain'; //todo remove
    this.type = 'villain';
    this.id = data.id || uuid();
  }

  get list() {
    return [this];
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
    this.refresh();
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
    this.refresh();
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
    this.refresh();
  }
  addModifier({name, type, amount, persistent, exclusive}) {
    if (name === '') return;
    else if (type === 'Bonus') {
      this.boost(name, amount, persistent, exclusive);
    } else if (type === 'Penalty') {
      this.hinder(name, amount, persistent, exclusive);
    } else if (type === 'Defend') {
      this.defend(name, amount);
    }
  }
  removeModifier(type, index) {
    const remove = () => {
      this[type].splice(index, 1);
      this.refresh();
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
  refresh() {
    store.dispatch('saveBaddies', 'villains');
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
    this.refresh();
  }
}

export {Baddie, Villain};