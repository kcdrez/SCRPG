import Vue from 'vue';
import store from '../vuex-state/store';
import {unvue} from './utilities';

class Baddie {
  constructor(name, size, count, types, baddieType, acted) {
    this.name = name;
    this.baddieType = baddieType;
    this.acted = acted === undefined ? false : acted;
    this.types = {
      12: [],
      10: [],
      8: [],
      6: [],
      4: []
    };
    if (size) {
      for (let i = 0; i < count; i++) {
        this.addBaddie(size, [], [], []);
      }
    } else if (types) {
      this.types = types;
    }
  }

  demote(size, index) {
    const {bonuses, penalties, defends} = this.types[size][index];
    this.remove(size, index);
    if (size > 4) {
      this.addBaddie(size - 2, bonuses, penalties, defends);
    }
  }
  addBaddie(size, bonuses, penalties, defends, count) {
    count = count || 1;
    const match = this.types[size].find(x => {
      return JSON.stringify(bonuses) === JSON.stringify(x.bonuses) &&
        JSON.stringify(penalties) === JSON.stringify(x.penalties) &&
        JSON.stringify(defends) === JSON.stringify(x.defends);
    });
    if (match) {
      match.count += count;
    } else {
      this.types[size].push({ bonuses, penalties, defends, count});
    }
  }
  remove(size, index) {
    if (this.types[size][index].count === 1) {
      this.types[size].splice(index, 1);
    } else {
      this.types[size][index].count--;
    }
  }
  boost(name, amount, size, index, {persistent, exclusive}) {
    const {bonuses, penalties, defends} = this.types[size][index];
    this.addBaddie(size, bonuses.concat({amount, name, persistent, exclusive}), penalties, defends);
    this.remove(size, index);
    this.refresh(size);
  }
  hinder(name, amount, size, index, {persistent, exclusive}) {
    const {bonuses, penalties, defends} = this.types[size][index];
    this.addBaddie(size, bonuses, penalties.concat({amount, name, persistent, exclusive}), defends);
    this.remove(size, index);
    this.refresh(size);
  }
  defend(name, amount, size, index) {
    const {bonuses, penalties, defends} = this.types[size][index];
    this.addBaddie(size, bonuses, penalties, defends.concat({amount, name}));
    this.remove(size, index);
    this.refresh(size);
  }
  countBySize(size) {
    return this.types[size].reduce((total, item) => {
      return total + item.count;
    }, 0);
  }
  refresh(size) {
    this.types[size] = unvue(this.types[size]).reduce((acc, el) => {
      const match = acc.find(x => {
        return JSON.stringify(x.bonuses) === JSON.stringify(el.bonuses) &&
          JSON.stringify(x.penalties) === JSON.stringify(el.penalties) &&
          JSON.stringify(x.defends) === JSON.stringify(el.defends);
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
  addAffix({name, type, amount, size, index, persistent, exclusive}) {
    if (name === '') return;
    else if (type === 'Bonus') {
      this.boost(name, amount, size, index, {persistent, exclusive});
    } else if (type === 'Penalty') {
      this.hinder(name, amount, size, index, {persistent, exclusive});
    } else if (type === 'Defend') {
      this.defend(name, amount, size, index);
    }
  }
  removeAffix(size, affixType, affixIndex, baddieIndex) {
    const affixData = this.types[size][baddieIndex][affixType];
    const remove = () => {
      if (affixData.count > 1) {
        const copy = unvue(affixData);
        affixData.count--;
        copy[type].splice(affixIndex, 1);
        this.addBaddie(size, copy.bonuses, copy.penalties, copy.defends, 1);
      } else {
        this.types[size][baddieIndex][affixType].splice(affixIndex, 1);
      }
      this.refresh(size);
    }
    if (affixData[affixIndex].exclusive || affixData[affixIndex].persistent) {
      Vue.dialog.confirm(`This ${affixType} is persistent and/or exclusive. Are you sure you want to remove it?`)
      .then(() => {
        remove();
      });
    } else { 
      remove();
    }
  }
  takenAction() {
    this.acted = !this.acted;
    store.dispatch('saveBaddies', this.baddieType);
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