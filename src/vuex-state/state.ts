import { Baddie, Villain } from '../scripts/baddie';
import { Player } from '../scripts/player';
import { Scene } from '../scripts/scene';

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