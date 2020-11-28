import Vue from 'vue';
import { v4 as uuid } from 'uuid';
import store from '../vuex-state/store';
import { Actor, ActorData } from './actor';
import { Baddie, BaddieData, ModifierData } from './baddie';

class Scene extends Actor {
  constructor(sceneData: SceneData) {
    super(sceneData as ActorData);
    this.import(sceneData);
    this.challenges = (sceneData?.challenges || []).map(x => new Challenge(x));
    this.locations = (sceneData?.locations || []).map(x => new Location(x));
    this.notes = sceneData?.notes || '';
  }
  public green: TrackerColor[] = [];
  public yellow: TrackerColor[] = [];
  public red: TrackerColor[] = [];
  public challenges: Challenge[] = [];
  public locations: Location[] = [];
  public notes: string = '';

  public get isEmpty(): boolean {
    return this.green.length === 0 &&
      this.yellow.length === 0 &&
      this.red.length === 0;
  }
  public get allowAddMinion(): boolean {
    return true;
  }

  public takenAction(): void {
    const minions: Baddie[] = store.getters.childMinions(this.id);
    const newStatus: boolean = !this.acted;
    const minionNotMatched: boolean = minions.some((x: Baddie) => x.acted !== newStatus);
    const message: string = newStatus ? 
      `Some of the environment's minions have not acted. Do you also want to mark all of it's minions as having acted too?`:
      `Some of the environment's minions have already acted. Do you also want to mark it's minions as having not acted?`;
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
  public create(green: number, yellow: number, red: number, name: string): void {
    for (let i = 0; i < green; i++) {
      this.green.push({checked: false});
    }
    for (let i = 0; i < yellow; i++) {
      this.yellow.push({checked: false});
    }
    for (let i = 0; i < red; i++) {
      this.red.push({checked: false});
    }
    this.name = name;
    this.save();
  }
  public clear(): void {
    const clearScene = (): void => {
      minions.forEach(minion => store.dispatch('removeBaddie', {id: minion.id, type: minion.type}));
      this.green = [];
      this.yellow = [];
      this.red = [];
      this.acted = false;
      this.name = '';
      this.challenges = [];
      this.locations = [];
      this.notes = '';
      this.save();
    }

    const minions: Baddie[] = store.getters.childMinions(this.id);
    if (minions.length > 0) {
      (Vue as any).dialog.confirm({
        title: 'Warning',
        body: 'Clearing the scene will remove all the environment\'s minions. Do you want to continue?'
      },
      {
        okText: 'Yes',
        cancelText: 'No'
      })
      .then(() => {
        clearScene();
      });
    } else {
      clearScene();
    }
  }
  public progressScene(element: TrackerColor): void {
    element.checked = !element.checked;
    this.save();
  }
  public addLocation(location: LocationData): void {
    this.locations.push(new Location(location));
    this.save();
  }
  public removeLocation(index: number): void {
    if (index >= 0) {
      this.locations.splice(index, 1);
      this.save();
    }
  }
  public resetLocations(): void {
    this.locations = [];
    store.dispatch('saveData', 'scene');
  }
  public addChallenge(challenge: ChallengeData, skipInitialize: boolean): void {
    this.challenges.push(new Challenge(challenge, skipInitialize));
    this.save();
  }
  public removeChallenge(index: number): void {
    if (index >= 0) {
      this.challenges.splice(index, 1);
      this.save();
    }
  }
  public resetChallenges(): void {
    this.challenges = [];
    store.dispatch('saveData', 'scene');
  }
  public setNote(note: string): void {
    this.notes = note;
    this.save();
  }
  public export(challengeId: string): EnvironmentData {
    const minions: (BaddieData | ModifierData)[] = store.getters.childMinions(this.id)
      .reduce((acc: (BaddieData | ModifierData)[], minion: Baddie) => { 
        const {baddie, modifiers} = minion.export();
        if (baddie) acc.push(baddie);
        if (modifiers) acc.push(...modifiers);
        return acc;
      }, []);

    return {
      scene: this.name ? {
        id: this.id,
        name: this.name,
        acted: this.acted,
        notes: this.notes,
        green: this.exportSceneTracker(this.green),
        yellow: this.exportSceneTracker(this.yellow),
        red: this.exportSceneTracker(this.red),
        type: 'scene'
      } : null,
      locations: this.locations.map(x => x.export()),
      challenges: this.exportChallenges(challengeId),
      envMinions: minions
    }
  }
  private exportSceneTracker(arr: TrackerColor[]): string {
    const completed = arr.filter(x => x.checked).length;
    return `${completed}-${arr.length}`;
  }
  private exportChallenges(id: string | null = null): (ChallengeData | ChallengeEntryData)[] {
    return this.challenges.reduce((acc: (ChallengeData | ChallengeEntryData)[], challenge: Challenge) => { 
      if (!id || challenge.id === id) {
        acc.push(challenge.export());
        challenge.list.forEach(challengeEntry => {
          acc.push(challengeEntry.export(challenge.id));
        });
      }
      return acc;
    }, []);
  }
  public import(data: SceneData): void {
    this.clear();
    const greens = data?.green?.split('-') || [0, 0];
    const yellows = data?.yellow?.split('-') || [0 ,0];
    const reds = data?.red?.split('-') || [0, 0];
    this.create(Number(greens[1]), Number(yellows[1]), Number(reds[1]), data.name || 'Default Environment');
    for (let i = 0; i < Number(greens[0]); i++) {
      this.progressScene(this.green[i]);
    }
    for (let i = 0; i < Number(yellows[0]); i++) {
      this.progressScene(this.yellow[i]);
    }
    for (let i = 0; i < Number(reds[0]); i++) {
      this.progressScene(this.red[i]);
    }
    this.acted = data.acted || false;
    this.notes = data.notes || '';
    this.id = data.id || this.id;
  }
}

class Challenge {
  constructor({
    id,
    name,
    list
  }: ChallengeData, skipInitialize = false) {
    this.id = id || uuid();
    this.name = name;
    this.list = (list || []).map(x => new ChallengeEntry(x));
    if (!skipInitialize) this.initialize();
  }
  public id: string = '';
  public name: string = '';
  public list: ChallengeEntry[] = [];
  
  private initialize(): void {
    if (this.list.length === 0) {
      this.add({ label: `Complete ${this.name}` });
    }
  }
  public add(data: ChallengeEntryData): void {
    if (!data.label) return;
    this.list.push(new ChallengeEntry(data));
    this.save();
  }
  public remove(index: number): void {
    if (index >= 0) {
      this.list.splice(index, 1);
      this.save();
      if (this.list.length === 0) {
        (Vue as any).dialog.confirm({
          title: 'No Challenges',
          body: 'This Challenge has no elements. Do you want to remove it?'
        },
        {
          okText: 'Yes',
          cancelText: 'No'
        })
        .then(() => {
          const thisIndex = store.state.scene?.challenges.findIndex(x => x.id === this.id) || -1;
          store.state.scene?.removeChallenge(thisIndex);
        });
      }
    }
  }
  public save(): void {
    store.dispatch('saveData', 'scene');
  }
  public export(): ChallengeData {
    return {
      id: this.id,
      name: this.name,
      type: 'challenge'
    }
  }
}

class ChallengeEntry {
  constructor({
    id,
    label,
    tempLabel,
    editing,
    completed
  }: ChallengeEntryData) {
    this.id = id || uuid();
    this.label = label || name || '';
    this.tempLabel = label || tempLabel || '';
    this.editing = editing || false;
    this.completed = completed || false;
  }
  public id: string = '';
  public label: string = '';
  public tempLabel: string = '';
  public editing: boolean = false;
  public completed: boolean = false;

  public complete(): void {
    this.completed = !this.completed;
    this.save();
  }
  public beginEdit(): void {
    this.editing = true;
  }
  public edit(): void {
    this.editing = false;
    this.label = this.tempLabel;
    this.save();
  }
  public cancel(): void {
    this.editing = false;
  }
  public save(): void {
    store.dispatch('saveData', 'scene');
  }
  public export(parent: string): ChallengeEntryData {
    return {
      name: this.label,
      parent,
      completed: this.completed,
      type: 'challenge element'
    }
  }
}

class Location {
  constructor({
    id,
    name,
    description,
    editing,
    tempName,
    tempDescription
  }: LocationData) {
    this.id = id || uuid();
    this.name = name || '';
    this.description = description || '';
    this.editing = editing || false;
    this.tempName = tempName || name || '';
    this.tempDescription = tempDescription || description || '';
  }
  public id: string = '';
  public name: string = '';
  public editing: boolean = false;
  public description: string = '';
  public tempName: string = '';
  public tempDescription: string = '';

  public beginEdit(): void {
    this.editing = true; 
  }
  public edit(): void {
    this.editing = false;
    this.name = this.tempName;
    this.description = this.tempDescription;
    this.save();
  }
  public save(): void {
    store.dispatch('saveData ', 'scene');
  }
  public export(): LocationData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'location'
    }
  }
}

interface TrackerColor {
  checked: boolean;
}

interface SceneData {
  id: string,
  name: string | null,
  tempName?: string,
  acted?: boolean,
  editing?: boolean,
  type?: string,
  green?: string,
  yellow?: string,
  red?: string,
  challenges?: Challenge[],
  locations?: Location[],
  notes?: string
}

interface LocationData {
  id: string,
  name: string,
  type?: string,
  editing?: boolean,
  description: string,
  tempName?: string,
  tempDescription?: string
}

interface ChallengeData {
  id?: string,
  name: string,
  list?: ChallengeEntryData[],
  type?: string
}

interface ChallengeEntryData {
  id?: string,
  label?: string,
  name?: string,
  tempLabel?: string,
  editing?: boolean,
  completed?: boolean,
  parent?: string,
  type?: string
}

interface EnvironmentData {
  scene: SceneData | null, 
  locations: LocationData[], 
  challenges: (ChallengeData | ChallengeEntryData)[],
  envMinions: (BaddieData | ModifierData)[]
}

export default Scene;
export { Scene, SceneData, Challenge, ChallengeData, ChallengeEntryData, Location, LocationData};