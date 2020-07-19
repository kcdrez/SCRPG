import Vue from 'vue';
import store from '../vuex-state/store';
import {unvue} from './utilities';

class Baddie {
  constructor(data, baddieType) {
    this.name = data.name;
    this.baddieType = baddieType;
    this.list = [];
    if (data.types) {
      Object.entries(data.types).forEach(([size, baddieData]) => {
        baddieData.forEach(x => this.addBaddie(x, size))
      })
    } else if (data.list) {
      this.list = data.list;
    } else {
      this.addBaddie({size: data.size, count: data.count});
    }
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
      console.log(copy)
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
      match.count++;
    } else {
      this.list.push(baddie);
    }
  }
  remove(baddie) {
    if (baddie.count <= 1) {
      const index = this.match(baddie, true);
      if (index > -1) {
        this.list.splice(index, 1);
        if (this.list.length === 0) {
          store.commit('DELETE_BADDIE', {baddie: this, baddieType: this.baddieType});
        }
      }
    } else {
      baddie.count--;
    }
  }
  boost(name, amount, persistent, exclusive, baddie) {
    const copy = unvue(baddie);
    copy.count = 1;
    copy.bonuses.push({amount, name, persistent, exclusive});
    this.addBaddie(copy);
    this.remove(baddie);
    this.refresh(baddie.size);
  }
  hinder(name, amount, persistent, exclusive, baddie) {
    const copy = unvue(baddie);
    copy.penalties.push({amount, name, persistent, exclusive});
    this.addBaddie(copy);
    this.remove(baddie);
    this.refresh(baddie.size);
  }
  defend(name, amount, baddie) {
    const copy = unvue(baddie);
    copy.defends.push({amount, name});
    this.addBaddie(copy);
    this.remove(baddie);
    this.refresh(baddie.size);
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
  refresh(size) {
    this.list = unvue(this.list).reduce((acc, el) => {
      const match = acc.find(x => {
        return JSON.stringify(x.bonuses) === JSON.stringify(el.bonuses) &&
          JSON.stringify(x.penalties) === JSON.stringify(el.penalties) &&
          JSON.stringify(x.defends) === JSON.stringify(el.defends) &&
          x.size === size;
      });
      if (match) {
        match.count += el.count;
      } else {
        acc.push(el);
      }
      return acc;
    }, []);
    store.dispatch('saveBaddies', this.baddieType);
  }
  addAffix({name, type, amount, persistent, exclusive}, baddie) {
    if (name === '') return;
    else if (type === 'Bonus') {
      this.boost(name, amount, persistent, exclusive, baddie);
    } else if (type === 'Penalty') {
      this.hinder(name, amount, persistent, exclusive, baddie);
    } else if (type === 'Defend') {
      this.defend(name, amount, baddie);
    }
  }
  removeAffix(baddie, affixType, affixIndex) {
    const affixData = baddie[affixType];
    const remove = () => {
      if (baddie.count > 1) {
        const copy = unvue(baddie);
        copy.count = 1;
        copy[affixType].splice(affixIndex, 1);
        this.remove(baddie);
        this.addBaddie(copy);
      } else {
        baddie[affixType].splice(affixIndex, 1);
      }
      this.refresh(baddie.size);
    }
    if (affixData[affixIndex].exclusive || affixData[affixIndex].persistent) {
      Vue.dialog.confirm({
        title: 'Are you sure?',
        body: `This ${affixType} is persistent and/or exclusive. Are you sure you want to remove it?`
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
  takenAction(index) {
    this.list[index].acted = !this.list[index].acted;
    store.dispatch('saveBaddies', this.baddieType);
  }
  resetRound() {
    this.list.forEach(x => x.acted = false);
  }
}

class Villain {
  constructor(name, bonuses, penalties, defends, acted) {
    this.name = name;
    this.acted = acted === undefined ? false : acted;
    this.bonuses = bonuses || [];
    this.penalties = penalties || [];
    this.defends = defends || [];
    this.baddieType = 'villain';
  }

  boost(name, amount, persistent, exclusive) {
    this.bonuses.push({name, amount, persistent, exclusive});
    this.refresh();
  }
  hinder(name, amount, persistent, exclusive) {
    this.penalties.push({name, amount, persistent, exclusive});
    this.refresh();
  }
  defend(name, amount) {
    this.defends.push({name, amount});
    this.refresh();
  }
  addAffix({name, type, amount, persistent, exclusive}) {
    if (name === '') return;
    else if (type === 'Bonus') {
      this.boost(name, amount, persistent, exclusive);
    } else if (type === 'Penalty') {
      this.hinder(name, amount, persistent, exclusive);
    } else if (type === 'Defend') {
      this.defend(name, amount);
    }
  }
  removeAffix(type, index) {
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
    this.acted = !this.acted;
    this.refresh();
  }
}

export {Baddie, Villain};