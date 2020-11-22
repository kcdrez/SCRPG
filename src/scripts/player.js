import Vue from 'vue';
import store from '../vuex-state/store';
import Actor from './actor';

class Player extends Actor {
  constructor(playerData) {
    super(playerData);
    this.initHp(playerData);
  }

  get hp() {
    return this._hp;
  }
  set hp(val) {
    if (val < 0 || val > this.maxHp) return;
    this._hp = val;
    this.tempHP = val;
    this.save();
  }
  // get typeLabel() {
  //   return this.type;
  // }
  get allowEdit() {
    return !this.editing;
  }
  get allowAddMinion() {
    return true;
  }
  get allowRemove() {
    return true;
  }
  get inGreen() {
    if (!this.status.green) return false;
    else return this.hp >= this.status.green;
  }
  get inYellow() {
    if (!this.status.green || !this.status.yellow) return false;
    else return this.hp >= this.status.yellow && this.hp < this.status.green;
  }
  get inRed() {
    if (!this.status.yellow) return false;
    else return this.hp >= 1 && this.hp < this.status.yellow;
  }
  get incapacitated() {
    return this.hp <= 0;
  }

  initHp({maxHp, hp, _hp, tempHP}) {
    let green;
    let yellow;

    switch (maxHp) {
      case 40:
      case 39:
        green = 30;
        yellow = 15;
        break;
      case 38:
      case 37:
        green = 29;
        yellow = 14;
        break;
      case 36:
        green = 28;
        yellow = 14;
        break;
      case 35:
        green = 27;
        yellow = 13;
          break;
      case 34:
      case 33:
        green = 26;
        yellow = 13;
        break;
      case 32:
        green = 25;
        yellow = 12;
        break;
      case 31:
        green = 24;
        yellow = 12;
        break;
      case 30:
        green = 23;
        yellow = 12;
        break;
      case 29:
        green = 23;
        yellow = 11;
        break;
      case 28:
        green = 22;
        yellow = 11;
        break;
      case 27:
        green = 21;
        yellow = 11;
        break;
      case 26:
        green = 21;
        yellow = 10;
        break;
      case 25:
        green = 20;
        yellow = 10;
        break;
      case 24:
        green = 19;
        yellow = 10;
        break;
      case 23:
        green = 19;
        yellow = 9;
        break;
      case 22:
        green = 18;
        yellow = 9;
        break;
      case 21:
        green = 17;
        yellow = 9;
        break;
      case 20:
        green = 16;
        yellow = 8;
        break;
      case 19:
      case 18:
        green = 15;
        yellow = 8;
        break;
      case 17:
        green = 14;
        yellow = 7;
        break;
    }
    this.status = {green, yellow};
    this.maxHp = maxHp || 40;
    this._hp = hp || _hp;
    this.tempHP = tempHP || this._hp;
  }
  takenAction() {
    const minions = store.getters.childMinions(this.id);
    const newStatus = !this.acted;
    const minionNotMatched = minions.some(x => x.acted !== newStatus);
    const message = newStatus ? 
      `Some of this player's minions have not acted. Generally, all minions act at the start of the turn. Do you also want to mark all of their minions as having acted too?`:
      `Some of this player's minions have already acted. Do you also want to mark their minions as having not acted?`;
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
  saveEdit() {
    this.hp = this.tempHP;
    super.saveEdit();
  }
  export() {
    const minions = store.getters.childMinions(this.id).reduce((acc, minion) => {
      const {baddie, modifiers} = minion.export();
      acc.push(baddie);
      acc.push(...modifiers);
      return acc;
    }, []);

    return {
      player: {
        id: this.id,
        name: this.name,
        hp: this.hp,
        acted: this.acted,
        type: this.type
      },
      minions
    }
  }
  remove() {
    store.dispatch('removePlayer', this.id)
  }
}

export default Player;
export {Player};