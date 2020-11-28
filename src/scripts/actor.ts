import { v4 as uuid } from 'uuid';
import store from '../vuex-state/store';
import { Modifier } from './baddie';

abstract class Actor {
  constructor({id, name, tempName, acted, editing, type}: ActorData) {
    this.id = id || uuid();
    this.name = name;
    this.tempName = tempName || name || '';
    this.acted = acted || false;
    this.editing = editing || false;
    this.type = type;
  }
  public id: string = '';
  public name: string | null = '';
  public tempName: string = '';
  public acted: boolean = false;
  public editing: boolean = false;
  public type: string = '';

  public get typeLabel(): string {
    switch (this.type) {
      case 'minions':
        return 'minion';
      case 'lieutenants':
        return 'lieutenant';
      default:
        return this.type;
    }
  }

  public save(): void {
    store.dispatch('saveData', this.type);
  }
  public beginEdit(): void {
    this.editing = true;
  }
  public cancelEdit(): void {
    this.editing = false;
  }
  public resetRound(): void {
    this.acted = false;
    this.save();
  }
  public takenAction(status: boolean | null = null): void {
    this.acted = status === null ? !this.acted : status;
    this.save();
  }
  public saveEdit(): void {
    this.editing = false;
    this.name = this.tempName;
    this.save();
  }
  public sortModifiers(list: Modifier[]): void {
    list.sort((a, b) => {
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
    this.save();
  }
}

interface ActorData {
  id?: string,
  name: string | null,
  tempName?: string,
  acted?: boolean,
  editing?: boolean,
  type: string
}

function sortActors(a: Actor, b: Actor): number {
  if (a.type > b.type) return -1;
  else if (b.type > a.type) return 1;
  else if (a.name > b.name) return -1;
  else if (b.name > a.name) return 1;
  else if (a.size > b.size) return -1;
  else if (b.size > a.size) return 1;
  else if (a.boosts.length > b.boosts.length) return -1;
  else if (b.boosts.length > b.boosts.length) return 1;
  else if (a.penalties.length > b.penalties.length) return -1;
  else if (b.penalties.length > b.penalties.length) return 1;
  else if (a.defends.length > b.defends.length) return -1;
  else if (b.defends.length > b.defends.length) return 1;
  else if (a.count > b.count) return -1;
  else if (b.count > a.count) return 1;
  else return 0;
}
export default Actor;
export {Actor, ActorData, sortActors};