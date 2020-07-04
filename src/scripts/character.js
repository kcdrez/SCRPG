import qualities from '../assets/qualities';
import {v4 as uuid} from 'uuid';
import {unvue} from './utilities';

class Character {
  constructor() {
    this._data = {
      background: null,
      powerSource: null,
      qualities: [],
      abilities: {
        green: [],
        yellow: [],
        red: []
      }
    };
  }

  get archetype() {
    return this._data.archetype;
  }
  set archetype(val) {
    this._data.archetype = val;
  }

  get background() {
    return this._data.background;
  }
  set background(val) {
    this._data.background = val;
  }
  get validBackground() {
    return this.qualities.length === this.background.qualities.dice.length;
  }

  get powerSource() {
    return this._data.powerSource;
  }
  set powerSource(val) {
    this._data.powerSource = val;
  }
  get validPowerSource() {
    return Object.entries(this.powerSource.abilities).reduce((acc, [key, {count}]) => {
      if (count === this.abilities[key].length && acc) {
        return true;
      } else {
        return false;
      }
    }, true);
  }

  get qualities() {
    return this._data.qualities;
  }
  set qualities(val) {
    this._data.qualities = val;
  }
  get qualityMessage() {
    const {dice, list, categories} = this._data.background.qualities;
    const mapped = dice.map(x => `d${x.dieSize}`);
    return `Assign a ${mapped.join(' and a ')} to ${mapped.length} of these qualities:`;
  }
  get qualitySelections() {
    const {list, categories} = this.background.qualities;
    let fullList = categories.reduce((acc, c) => {
      return acc.concat(qualities[c.toLowerCase()]);
    }, []);
    list.forEach(l => {
      let match = qualities.information.find(x => x.name.toLowerCase() === l.toLowerCase());
      if (!match) {
        match = qualities.mental.find(x => x.name.toLowerCase() === l.toLowerCase());
      }
      if (!match) {
        match = qualities.physical.find(x => x.name.toLowerCase() === l.toLowerCase());
      }
      if (!match) {
        match = qualities.social.find(x => x.name.toLowerCase() === l.toLowerCase());
      }
      if (match) {
        fullList.push(match);
      } else {
        console.error(l);
        alert('couldnt find a match');
      }
    });
    return fullList.reduce((acc, x) => {
      const match = acc.find(y => x.name === y.name);
      if (!match) acc.push(x);
      return acc;
    }, []);
  }
  get qualityAvailableDice() {
    return this.background.qualities.dice.reduce((acc, x) => {
      const match = this.qualities.find(y => y.id === x.id);
      if (match) acc.used.push(x);
      else acc.unused.push(x);
      return acc;
    }, {
      unused: [],
      used: []
    });
  }
  get abilities() {
    return this._data.abilities;
  }
  adjustQuality(quality, dieID) {
    if (dieID === '-') {
      const index = this.qualities.findIndex(x => x.name === quality.name);
      if (index >= 0) this.qualities.splice(index, 1);
    } else {
      const match = this.background.qualities.dice.find(x => x.id === dieID);
      if (match) {
        this.qualities.push(Object.assign({}, match, quality));
      } 
      else {
        console.error(unvue(quality), dieID);
        alert('No quality match');
      }
    }
  }
  options(quality) {
    return this.background.qualities.dice.reduce((acc, x) => {
      const diceMatch = this.qualities.find(q => q.id === x.id);
      const qualityMatch = this.qualities.find(q => q.name === quality.name);
      if (!diceMatch) acc.push(x);
      else if (qualityMatch) acc.push(x);
      else acc.push(Object.assign({disabled: true}, x)); //todo: figure out how to remove this
      return acc;
    }, [{id: '-', dieSize: '-'}]);
  }
  selectAbility(ability, color) {
    const index = this._data.abilities[color].findIndex(x => ability.name === x.name);
    if (index > -1) {
      this._data.abilities[color].splice(index, 1);
    } else {
      this._data.abilities[color].push(ability);
    }
  }
  disabledAbility(ability, color, count) {
    const match = this._data.abilities[color].find(x => ability.name === x.name);
    if (match) {
      return false;
    } else {
      return this._data.abilities[color].length === count;
    }
  }
}

export default Character;