import { Baddie, BaddieData, Villain, VillainData, sameBaddies, ModifierData } from '../scripts/baddie';
import { Player, PlayerData } from '../scripts/player';
import { Scene, SceneData, ChallengeData, ChallengeEntryData, LocationData } from '../scripts/scene';

interface State {
  initialized: boolean,
  lieutenants: Baddie[],
  minions: Baddie[],
  villains: Villain[],
  players: Player[],
  scene: Scene | null
}

const state: State = {
  initialized: false,
  lieutenants: [],
  minions: [],
  villains: [],
  players: [],
  scene: null //todo make this not null
}

export default state;
export { state, State };