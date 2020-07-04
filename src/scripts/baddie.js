import store from '../vuex-state/store';
import {unvue} from './utilities';

class Baddie {
  constructor(name, size, count, types, baddieType) {
    this.name = name;
    this.baddieType = baddieType;
    this.types = {
      12: [],
      10: [],
      8: [],
      6: [],
      4: []
    };
    if (size) {
      for (let i = 0; i < count; i++) {
        this.addBaddie(size, [], []);
      }
    } else if (types) {
      this.types = types;
    }
  }

  demote(size, index) {
    const {bonuses, penalties} = this.types[size][index];
    this.remove(size, index);
    if (size > 4) {
      this.addBaddie(size - 2, bonuses, penalties);
    }
  }
  addBaddie(size, bonuses, penalties, count) {
    count = count || 1;
    const match = this.types[size].find(x => {
      return JSON.stringify(bonuses) === JSON.stringify(x.bonuses) &&
        JSON.stringify(penalties) === JSON.stringify(x.penalties);
    });
    if (match) {
      match.count += count;
    } else {
      this.types[size].push({ bonuses, penalties, count});
    }
  }
  remove(size, index) {
    if (this.types[size][index].count === 1) {
      this.types[size].splice(index, 1);
    } else {
      this.types[size][index].count--;
    }
  }
  boost(name, amount, size, index) {
    const {bonuses, penalties} = this.types[size][index];
    this.addBaddie(size, bonuses.concat({amount, name}), penalties);
    this.remove(size, index);
    this.refresh(size);
  }
  hinder(name, amount, size, index) {
    const {bonuses, penalties} = this.types[size][index];
    this.addBaddie(size, bonuses, penalties.concat({amount, name}));
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
          JSON.stringify(x.penalties) === JSON.stringify(el.penalties);
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
  addAffix({name, type, amount, size, index}) {
    if (name === '') return;
    else if (type === 'Bonus') {
      this.boost(name, amount, size, index);
    } else {
      this.hinder(name, amount, size, index);
    }
  }
  removeAffix(size, affixType, affixIndex, baddieIndex) {
    const affixData = this.types[size][baddieIndex][affixType];
    if (affixData.count > 1) {
      const copy = unvue(affixData);
      affixData.count--;
      copy[type].splice(affixIndex, 1);
      this.addBaddie(size, copy.bonuses, copy.penalties, 1);
    } else {
      this.types[size][baddieIndex][affixType].splice(affixIndex, 1);
    }
    this.refresh(size);
  }
}

class Villain {
  constructor(name, bonuses, penalties) {
    this.name = name;
    this.bonuses = bonuses || [];
    this.penalties = penalties || [];
  }

  boost(name, amount) {
    this.bonuses.push({name, amount});
    this.refresh();
  }
  hinder(name, amount) {
    this.penalties.push({name, amount});
    this.refresh();
  }
  addAffix({name, type, amount}) {
    if (name === '') return;
    else if (type === 'Bonus') {
      this.boost(name, amount);
    } else {
      this.hinder(name, amount);
    }
  }
  removeAffix(type, index) {
    this[type].splice(index, 1);
    this.refresh();
  }
  refresh() {
    store.dispatch('saveBaddies', 'villains');
  }
}

export {Baddie, Villain};