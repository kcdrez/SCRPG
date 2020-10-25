import Vue from 'vue';
import {v4 as uuid} from 'uuid';
import store from '../vuex-state/store';

class Player {
  constructor(playerData) {
    this.name = playerData.name;
    this.id = playerData.id || uuid();
    this.acted = playerData.acted || false;
    this._hp = playerData.hp || playerData._hp;
    this.type = 'player';
  }

  get list() {
    return [this];
  }
  get hp() {
    return this._hp;
  }
  set hp(val) {
    this._hp = val;
    this.save();
  }

  takenAction() {
    const minions = store.getters.childMinions(this.id);
    const newStatus = !this.acted;
    const minionNotMatched = minions.some(minion => {
      const match = minion.list.find(x => x.acted !== newStatus);
      return !!match;
    });
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
          minion.takenAction(null, newStatus);
        })
      });
    }
    this.acted = newStatus;
    this.save();
  }
  save() {
    store.dispatch('saveBaddies', 'players');
  }
}

export default Player;
export {Player};