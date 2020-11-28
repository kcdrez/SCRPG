import Vue from 'vue';
import store from '../vuex-state/store';
import { unvue } from './utilities';
import { v4 as uuid } from 'uuid';
import Actor from './actor';

class Baddie extends Actor {
  constructor({
    id, name, tempName, acted, editing, type,
    owner, _owner, parent,
    size, count, _count,
    bonuses, penalties, defends
  }: BaddieData) {
    super({id, name, tempName, acted, editing, type,});
    this._owner = owner || _owner || parent || null;
    this.size = size || 12;
    this.bonuses = bonuses ? bonuses.map(x => new Modifier(x)) : [];
    this.penalties = penalties ? penalties.map(x => new Modifier(x)) : [];
    this.defends = defends ? defends.map(x => new Modifier(x)) : [];
    this._count = count || _count || 1;
    this.markForDeath = false;
  }
  private _owner: string | null = null;
  private _count: number =  1;
  public size: number = 12;
  public bonuses: Modifier[] = [];
  public penalties: Modifier[] = [];
  public defends: Modifier[] = [];
  public markForDeath: boolean = false;

  public get owner() {
    return store.getters?.byID(this._owner);
  }
  public get count(): number { return this._count; }
  public set count(val) {
    this._count = val;
    this.save();
  }
  public get allowAddMinion(): boolean { return false; }
  public get allowEdit(): boolean { return false; }

  demote(): void {
    const copy = this.copy();
    copy.id = uuid();
    copy.size = this.size - 2;
    copy.count = 1;
    if (copy.size >= 4) {
      this.count--;
      store.dispatch('upsertBaddie', copy);
    }
  }
  promote(): void {
    const copy = this.copy();
    copy.id = uuid();
    copy.size = this.size + 2;
    copy.count = 1;
    if (copy.size <= 12) {
      this.count--;
      store.dispatch('upsertBaddie', copy);
    }
  }
  addModifier(modifierData: ModifierData): void {
    if (!modifierData.name) return;

    switch (modifierData.type.toLowerCase()) {
      case 'bonus':
        this.bonuses.push(new Modifier(modifierData));
        this.sortModifiers(this.bonuses);
        break;
      case 'penalty':
        this.penalties.push(new Modifier(modifierData));
        this.sortModifiers(this.penalties);
        break;
      case 'defend':
        this.defends.push(new Modifier(modifierData));
        this.sortModifiers(this.defends);
        break;
    }
  }
  removeModifier(type: string, index: number): void {
    if (type === 'bonuses' || type === 'penalties' || type === 'defends') {
      const remove = (): void => {
        const copy = this.copy();
        copy[type]?.splice(index, 1);
        copy.id = uuid();
        copy.count = 1;
        this.count--;
        if (copy.count > 0) store.dispatch('upsertBaddie', copy);
        this.save();
      }
  
      if (this[type][index].exclusive || this[type][index].persistent) {
        (Vue as any).dialog.confirm({
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
  }
  public save(): void {
    if (this.count <= 0) {
      store.dispatch('removeBaddie', {type: this.type, id: this.id});
    } else {
      store.dispatch('reconcile', this.type);
    }
  }
  public export(id = null): {baddie?: BaddieData, modifiers?: ModifierData[]} {
    if (!id || this.id === id) {
      const modifiers: ModifierData[] = [
        ...this.bonuses.map(x => x.export(this.id)),
        ...this.penalties.map(x => x.export(this.id)),
        ...this.defends.map(x => x.export(this.id)),
      ];
  
      return {
        baddie: {
          name: this.name,
          type: this.type,
          parent: this._owner,
          id: this.id,
          size: this.size,
          acted: this.acted,
          count: this.count
        },
        modifiers
      }
    } else return {};
  }
  public copy(): BaddieData {
    return Object.assign({
      bonuses: this.bonuses.map(x => x.export(this.id)),
      penalties: this.penalties.map(x => x.export(this.id)),
      defends: this.defends.map(x => x.export(this.id)),
    }, this.export().baddie);
  }
}

class Villain extends Actor {
  constructor(data: VillainData) {
    super(data);
    this.bonuses = data.bonuses ? data.bonuses.map(x => new Modifier(x)) : [];
    this.penalties = data.penalties ? data.penalties.map(x => new Modifier(x)) : [];
    this.defends = data.defends ? data.defends.map(x => new Modifier(x)) : [];
  }
  public bonuses: Modifier[];
  public penalties: Modifier[];
  public defends: Modifier[];

  public get allowAddMinion(): boolean {
    return true;
  }
  public get allowEdit(): boolean {
    return true;
  }

  public addModifier({name, type, amount, persistent, exclusive}: ModifierData): void {
    if (name === '') return;
    switch (type.toLowerCase()) {
      case 'bonus':
        this.bonuses.push(new Modifier({name, type, amount, persistent, exclusive}));
        this.sortModifiers(this.bonuses);
        break;
      case 'penalty':
        this.penalties.push(new Modifier({name, type, amount, persistent, exclusive}));
        this.sortModifiers(this.penalties);
        break;
      case 'defend':
        this.defends.push(new Modifier({name, type, amount, persistent, exclusive}));
        this.sortModifiers(this.defends);
        break;
    }
  }
  public removeModifier(type: string, index: number): void {
    if (type === 'bonuses' || type === 'penalties' || type === 'defends') {
      const remove = () => {
        this[type].splice(index, 1);
        this.save();
      }

      if (this[type][index].exclusive || this[type][index].persistent) {
        (Vue as any).dialog.confirm(`This ${type} is persistent and/or exclusive. Are you sure you want to remove it?`)
        .then(() => {
          remove();
        });
      } else { 
        remove();
      }
    }
  }
  public takenAction(): void {
    const minions: Baddie[] = store.getters.childMinions(this.id); 
    const newStatus = !this.acted;
    const minionNotMatched = minions.some(x => x.acted !== newStatus);
    const message = newStatus ? 
      `Some of this villain's minions have not acted. Generally, all minions act at the start of the turn. Do you also want to mark all of their minions as having acted too?`:
      `Some of this villain's minions have already acted. Do you also want to mark their minions as having not acted?`;
    if (minionNotMatched && minions.length > 0) {
      (Vue as any).dialog.confirm({
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
  public export(): {baddie: VillainData, minions: (BaddieData | ModifierData)[], modifiers: ModifierData[]} {
    const minions: (BaddieData | ModifierData)[] = store.getters.childMinions(this.id).reduce((acc: (BaddieData | ModifierData)[], minion: Baddie) => {
      const {baddie, modifiers} = minion.export();
      if (baddie) acc.push(baddie);
      if (modifiers) acc.push(...modifiers);
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
        ...this.bonuses.map(x => x.export(this.id)),
        ...this.defends.map(x => x.export(this.id)),
        ...this.penalties.map(x => x.export(this.id))
      ],
      minions
    }
  }
  public copy(): VillainData {
    return Object.assign({
      bonuses: this.bonuses.map(x => x.export(this.id)),
      penalties: this.penalties.map(x => x.export(this.id)),
      defends: this.defends.map(x => x.export(this.id)),
    }, this.export().baddie);
  }
}

class Modifier {
  constructor(data: ModifierData) {
    this.id = data.id || uuid();
    this.name = data.name;
    this.amount = data.amount;
    this.exclusive = data.exclusive || false;
    this.persistent = data.persistent || false;
    this.type = data.type;
  }
  public id: string = '';
  public name: string = '';
  public amount: number = 1;
  public exclusive: boolean = false;
  public persistent: boolean = false;
  public type: string = '';

  public export(parent: string): ModifierData {
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

interface BaddieData {
  id: string, 
  name: string, 
  tempName?: string, 
  acted?: boolean, 
  editing?: boolean, 
  type: string,
  owner?: string, 
  _owner?: string, 
  parent?: string | null,
  size: number, 
  count: number, 
  _count?: number,
  bonuses?: ModifierData[], 
  penalties?:  ModifierData[], 
  defends?:  ModifierData[],
  forceCreate?: boolean
}

interface VillainData {
  id: string, 
  name: string, 
  tempName?: string, 
  acted?: boolean, 
  editing?: boolean, 
  type: string,
  bonuses?: ModifierData[], 
  penalties?:  ModifierData[], 
  defends?:  ModifierData[]
}

interface ModifierData {
  id?: string,
  name: string,
  amount: number,
  exclusive?: boolean,
  persistent?: boolean
  type: string,
  parent?: string | null,
  target?: string,
  applyTo?: string
}

function sameBaddies(baddie1: Baddie, baddie2: Baddie) {
  return baddie1.name === baddie2.name &&
    JSON.stringify(baddie1.bonuses) === JSON.stringify(baddie2.bonuses) &&
    JSON.stringify(baddie1.penalties) === JSON.stringify(baddie2.penalties) &&
    JSON.stringify(baddie1.defends) === JSON.stringify(baddie2.defends) &&
    baddie1.size === baddie2.size;
}

export {Baddie, BaddieData, Villain, VillainData, Modifier, ModifierData, sameBaddies};