import Vue from 'vue';
import store from '../vuex-state/store';
import Actor from './actor';
import { Baddie, BaddieData, ModifierData, sameBaddies } from '../scripts/baddie';

class Player extends Actor {
  constructor(playerData: PlayerData) {
    super(playerData);
    this.initHp(playerData);
  }
  private _hp: number = 40;
  public maxHp: number = 40;
  public tempHp: number = 40;
  public status: {green: number, yellow: number} = {
    green: 30, yellow: 15
  };


  public get hp(): number {
    return this._hp;
  }
  public set hp(val: number) {
    if (val < 0 || val > this.maxHp) return;
    this._hp = val;
    this.tempHp = val;
    this.save();
  }
  public get allowEdit(): boolean {
    return !this.editing;
  }
  public get allowAddMinion(): boolean {
    return true;
  }
  public get allowRemove(): boolean {
    return true;
  }
  public get inGreen(): boolean {
    if (!this.status.green) return false;
    else return this.hp >= this.status.green;
  }
  public get inYellow(): boolean {
    if (!this.status.green || !this.status.yellow) return false;
    else return this.hp >= this.status.yellow && this.hp < this.status.green;
  }
  public get inRed(): boolean {
    if (!this.status.yellow) return false;
    else return this.hp >= 1 && this.hp < this.status.yellow;
  }
  public get incapacitated(): boolean {
    return this.hp <= 0;
  }

  initHp({maxHp, hp, _hp, tempHp}: PlayerHp): void {
    let green: number = 0;
    let yellow: number = 0;

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
    this._hp = hp || _hp || this.maxHp;
    this.tempHp = tempHp || this._hp;
  }
  public takenAction(): void {
    const minions: Baddie[] = store.getters.childMinions(this.id);
    const newStatus: boolean = !this.acted;
    const minionNotMatched: boolean = minions.some(x => x.acted !== newStatus);
    const message: string = newStatus ? 
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
  public saveEdit(): void {
    this.hp = this.tempHp;
    super.saveEdit();
  }
  public export(): {player: PlayerData, minions: (BaddieData | ModifierData)[]} {
    const minions: (BaddieData | ModifierData)[] = store.getters.childMinions(this.id).reduce((acc: (BaddieData | ModifierData)[], minion: Baddie) => {
      const {baddie, modifiers} = minion.export();
      if (baddie) acc.push(baddie);
      if (modifiers) acc.push(...modifiers);
      return acc;
    }, []);

    return {
      player: {
        id: this.id,
        name: this.name,
        hp: this.hp,
        acted: this.acted,
        type: this.type,
        maxHp: this.maxHp,
        tempHp: this.tempHp
      },
      minions
    }
  }
  public remove(): void {
    store.dispatch('removePlayer', this.id)
  }
}

interface PlayerData {
  id?: string,
  name: string,
  tempName?: string,
  acted?: boolean,
  editing?: boolean,
  type: string,
  maxHp: number, 
  hp: number, 
  _hp?: number, 
  tempHp: number
}

interface PlayerHp {
  maxHp: number, 
  hp: number, 
  _hp?: number, 
  tempHp: number
}

export default Player;
export {Player, PlayerData};