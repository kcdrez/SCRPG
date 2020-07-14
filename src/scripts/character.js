import qualities from '../assets/qualities';
import {powers} from '../assets/powerSources';
import {v4 as uuid} from 'uuid';
import {unvue} from './utilities';

class Character {
  constructor() {
    this._data = {
      background: null,
      powerSource: null,
      powers: [],
      qualities: [],
      archetype: null,
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
    this.powers = [];
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
  get powers() {
    return this._data.powers;
  }
  set powers(val) {
    this._data.powers = val;
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
  qualityOptions(quality, dice) {
    return dice.reduce((acc, x) => {
      const diceMatch = this.qualities.find(q => q.id === x.id);
      const qualityMatch = this.qualities.find(q => q.name === quality.name);
      if (!diceMatch) acc.push(x);
      else if (qualityMatch) acc.push(x);
      else acc.push(Object.assign({disabled: true}, x)); //todo: figure out how to remove this
      return acc;
    }, [{id: '-', dieSize: '-'}]);
  }
  selectAbility(ability, abilityData, color, value, selection) {
    let replacement = null;
    const selectionList = this.abilityOptions(ability, abilityData, color);
    if (selectionList[selection]) {
      replacement = selectionList[selection].find(x => x.value === value).replacement;
    }
    const index = this.abilities[color].findIndex(x => ability.name === x.name);
    if (index > -1) {
      this.abilities[color].splice(index, 1);
      delete ability.display;
      delete ability.value;
    } else {
      if (replacement) ability.display = ability.description.replace(replacement, value);
      ability.value = value;
      this.abilities[color].push(ability);
    }
  }
  abilityOptions(ability, abilityData, color) {
    let selection1 = null;
    let selection2 = null;
    let match = null;
    if (ability.description.includes('[power]')) {
      selection1 = this.powers.map(power => {
        return {
          value: power.name,
          replacement: '[power]',
          disabled: this.disabledAbility(abilityData, color, ability, power.name)
        }
      });
    }
    if (ability.description.includes('[energy/element]')) {
      const data = powers.filter(power => power.category === 'Elemental/Energy').map(power => {
        return {
          value: power.name,
          replacement: '[energy/element]',
          disabled: this.disabledAbility(abilityData, color, power.name)
        }
      });
      if (selection1) {
        selection2 = data;
      } else {
        selection1 = data;
      }
    }
    if (ability.description.includes('[quality]')) {
      const data = this.qualities.map(quality => {
        return {
          value: quality.name,
          replacement: '[quality]',
          disabled: this.disabledAbility(abilityData, color, quality.name)
        }
      });
      if (selection1) {
        selection2 = data;
      } else {
        selection1 = data;
      }
    } 
    if (ability.description.includes('[physical or energy]')) {
      const data = ['Physical', 'Energy'].map(type => {
        return {
          value: type,
          replacement: '[physical or energy]',
          disabled: this.disabledAbility(abilityData, color, type)
        }
      });
      if (selection1) {
        selection2 = data;
      } else {
        selection1 = data;
      }
    }
    if (ability.description.includes('[energy/element you have a related power for]')) {
      const data = this.powers.filter(power => power.category === 'Elemental/Energy').map(power => {
        return {
          value: power.name,
          replacement: '[energy/element you have a related power for]',
          disabled: this.disabledAbility(abilityData, color, power.name)
        }
      });
      if (selection1) {
        selection2 = data;
      } else {
        selection1 = data;
      }
    }
    if (ability.description.includes('[Boost or Hinder]')) {
      const data = ['Boost', 'Hinder'].map(action => {
        return {
          value: action,
          replacement: '[Boost or Hinder]',
          disabled: this.disabledAbility(abilityData, color, action)
        }
      })
      if (selection1) {
        selection2 = data;
      } else {
        selection1 = data;
      }
    }
    if (selection1) {
      selection1 = [{value: '-'}].concat(selection1);
    }
    if (selection2) {
      selection2 = [{value: '-'}].concat(selection2)
    }

    return {
      selection1,
      selection2
    }
  }
  disabledAbility(map, color, ability, matchEl) {
    const hasMax = map.count === this.abilities[color].length;
    const match = map.list.find(src => {
      const matchName = src.name !== ability.name;
      const matchVal = matchEl ? src.value === matchEl : false;
      return matchName && matchVal;
    });
    if (matchEl) {
      return hasMax || Boolean(match);
    } else {
      return Boolean(match);
    }
  }
  selectPower(power, dieID) {
    const index = this.powers.findIndex(x => x.name === power.name);
    const match = this.background.powerSource.find(x => x.id === dieID);
    if (dieID === '-' || index > -1) {
      this.powers.splice(index, 1);
    } 
    if (match) {
      this.powers.push(Object.assign({}, match, power));
    }
  }
  powerOptions(power) {
    return this.background.powerSource.reduce((acc, src) => {
      const diceMatch = this.powers.find(p => p.id === src.id);
      const powerMatch = this.qualities.find(q => q.name === power.name);
      if (!diceMatch) acc.push(src);
      else if (powerMatch) acc.push(src);
      else acc.push(Object.assign({disabled: true}, src)); //todo: figure out how to remove this
      return acc;
    }, [{id: '-', dieSize: '-'}]);
  }
  archetypePowerOptions(power) {
    return this.powerSource.archetype.reduce((acc, src) => {
      const diceMatch = this.powers.find(p => p.id === src.id);
      const powerMatch = this.qualities.find(q => q.name === power.name);
      if (!diceMatch) acc.push(src);
      else if (powerMatch) acc.push(src);
      else acc.push(Object.assign({disabled: true}, src)); //todo: figure out how to remove this
      return acc;
    }, [{id: '-', dieSize: '-'}]);
  }
  archetypeDice(data, type) {
    if (type === 'power') {
      return this.powerOptions(data);
    } else if (type === 'quality') {
      qualityOptions
    } else {
      return [{id: '-', dieSize: '-'}];
    }
  }
}

export default Character;