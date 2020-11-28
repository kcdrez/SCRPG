import { State } from './state';
import {  ActionTree } from 'vuex';
import xlsx from 'xlsx';
import Cookies from 'js-cookie';
import { v4 as uuid } from 'uuid';

import { Baddie, BaddieData, Villain, VillainData, sameBaddies, ModifierData } from '../scripts/baddie';
import { PlayerData } from '../scripts/player';
import { SceneData, ChallengeData, ChallengeEntryData, LocationData } from '../scripts/scene';
import { processXlsxFiles, ImportData } from '../scripts/xlsx_utils';


const actions = <ActionTree<State, any>> {
  async initialize(ctx) {
    if (!ctx.state.initialized) {
      const minions: BaddieData[] | null = Cookies.getJSON('minions') || null;
      const lieutenants: BaddieData[] | null = Cookies.getJSON('lieutenants') || null;
      const villains: VillainData[] | null = Cookies.getJSON('villains') || null;
      const players: PlayerData[] | null = Cookies.getJSON('players') || null;
      const scene: SceneData = Cookies.getJSON('scene') || { id: uuid(), name: null };
      ctx.commit('INIT', {
        minions, lieutenants, villains, players, scene
      });
    }
  },
  saveData(ctx, dataType: string) {
    switch (dataType) {
      case 'minions':
      case 'lieutenants':
      case 'villains':
      case 'players':
      case 'scene':
        Cookies.set(dataType, ctx.rootState[dataType] || {}, {sameSite: 'strict'});
        break;
      default:
        console.warn(`Unable to save the data for ${dataType}.`);
    }
  },
  resetScene(ctx) {
    ctx.commit('RESET_SCENE');
    ctx.dispatch('saveData', 'minions');
    ctx.dispatch('saveData', 'lieutenants');
    ctx.dispatch('saveData', 'villains');
    ctx.dispatch('saveData', 'scene');
  },
  resetRound(ctx) {
    ctx.commit('RESET_ROUND');
  },
  upsertBaddie(ctx, baddieData: BaddieData | VillainData) {
    if ('forceCreate' in baddieData && (baddieData.type === 'minions' || baddieData.type === 'lieutenants')) {
      if (baddieData.forceCreate) {
        ctx.commit('CREATE_BADDIE', new Baddie(baddieData));
      } else {
        ctx.commit('UPSERT_BADDIE', new Baddie(baddieData));
      }
    } else if (baddieData.type === 'villains') {
      ctx.commit('UPSERT_VILLAIN', new Villain(baddieData));
    } else {
      console.warn(`Cannot upsert data of type: ${baddieData.type}`);
    }
    ctx.dispatch('saveData', baddieData.type);
  },
  modifyBaddie(ctx, {modifier, type}: {modifier: ModifierData, type: string}) {
    if (type === 'minions' || type === 'lieutenants') {
      const match = ctx.state[type].find(minion => minion.id === modifier.target);

      if (match) {
        if (modifier.applyTo === 'row') {
          match.addModifier(modifier);
        } else if (modifier.applyTo === 'name') {
          ctx.state[type].forEach(baddie => {
            if (baddie.name === match?.name) {
              baddie.addModifier(modifier);
            }
          });
        } else {
          const copy = match.copy();
          copy.id = uuid();
          copy.count = modifier.applyTo === 'single' ? 1 : match.count;
          match.count--;
          const newBaddie = new Baddie(copy);
          newBaddie.addModifier(modifier);
          ctx.commit('UPSERT_BADDIE', newBaddie);
        }
        ctx.dispatch('saveData', type);
      }
    }
  },
  modifyVillain(ctx, {modifier}: {modifier: ModifierData}) {
    const match = ctx.state.villains.find(villain => villain.id === modifier.target);
    if (match) {
      const copy = match.copy();
      const newVillain = new Villain(copy);
      newVillain.addModifier(modifier);
      ctx.commit('UPSERT_VILLAIN', newVillain);
    }
  },
  removeBaddie(ctx, {id, type}: {id: string, type: string}) {
    if (type === 'minions' || type === 'lieutenants') {
      const index = ctx.state[type].findIndex(x => x.id === id);
      if (index >= 0) { 
        ctx.commit('DELETE_BADDIE', {type, index});
        ctx.dispatch('saveData', type);
      }
    }
  },
  removeVillain(ctx, id: string) {
    const index = ctx.state.villains.findIndex(x => x.id === id);
    if (index >= 0) { 
      ctx.commit('DELETE_BADDIE', {type: 'villains', index});
      ctx.dispatch('saveData', 'villains');
    }
  },
  addPlayer(ctx, playerData: PlayerData) {
    if (!ctx.state.players.find(x => x.id === playerData.id)) {
      ctx.commit('ADD_PLAYER', playerData);
      ctx.dispatch('saveData', 'players');
    }
  },
  removePlayer(ctx, id: string) {
    ctx.commit('REMOVE_PLAYER', id);
    ctx.dispatch('saveData', 'players');
  },
  resetPlayers(ctx) {
    ctx.commit('RESET_PLAYERS');
    ctx.dispatch('saveData', 'players'); 
  },
  reconcile(ctx, type: string) {
    if (type === 'minions' || type === 'lieutenants') {
      for (let i = 0; i < ctx.state[type].length - 1; i++) {
        if (sameBaddies(ctx.state[type][i], ctx.state[type][i+1])) {
          ctx.state[type][i].count += ctx.state[type][i+1].count;
          ctx.state[type][i+1].markForDeath = true;
        }
      }
      ctx.state[type] = ctx.state[type].filter(x => !x.markForDeath);
    }
  },
  export(ctx, options) {
    const {type, fileName, id} = options || {};
    const rows: any[] = [];
    const {scene, challenges, locations, envMinions} = ctx.state.scene?.export(id) || {};
    if (type === 'scene' || !type) {
      if (scene) rows.push(scene);
      if (envMinions) rows.push(...envMinions);
    }
    if (type === 'challenges' || !type) {
      if (challenges) rows.push(...challenges);
    }
    if (type === 'locations' || !type) {
      if (locations) rows.push(...locations);
    }
    if (type === 'players' || !type) {
      ctx.state.players.forEach(playerEl => {
        const {player, minions} = playerEl.export();
        rows.push(player, ...minions.filter(minion => {
          return !rows.find(row => row.id === minion.id);
        }));
      });
    }
    if (type === 'villains' || !type) {
      ctx.state.villains.forEach(x => {
        const {baddie, modifiers, minions} = x.export();
        rows.push(baddie, ...modifiers, ...minions.filter(minion => {
          return !rows.find(row => row.id === minion.id);
        }));
      });
    }
    if (type === 'lieutenants' || !type) {
      ctx.state.lieutenants.forEach(x => {
        const {baddie, modifiers} = x.export();
        if (baddie) rows.push(baddie);
        if (modifiers) rows.push(...modifiers);
      });
    }
    if (type === 'minions' || !type) {
      ctx.state.minions.forEach(minion => {
        if (!rows.find(row => row.id === minion.id)) {
          const {baddie, modifiers} = minion.export();
          if (baddie) rows.push(baddie);
          if (modifiers) rows.push(...modifiers);
        }
      });
    }
    console.log(rows);
    
    const wb = xlsx.utils.book_new();
    const sceneWS = xlsx.utils.json_to_sheet(rows);

    xlsx.utils.book_append_sheet(wb, sceneWS, "SCRPG");

    xlsx.writeFile(wb, (fileName || 'SCRPG-GM') + '.xlsx');
  },
  async import(ctx, data) {
    const {files, filters} = data;
    if (!files) return;
    (await processXlsxFiles(files, filters)).forEach((row: ImportData) => {
      // console.log(row);
      if (!row.type) return;
      switch (row.type.toLowerCase()) {
        case 'player':
        case 'players':
          ctx.dispatch('addPlayer', row);
          break;
        case 'scene':
        case 'environment':
          ctx.state.scene?.import(row as SceneData);
          break;
        case 'minion':
        case 'minions':
        case 'lieutenant':
        case 'lieutenants':
        case 'villain':
        case 'villains':
          ctx.dispatch('upsertBaddie', Object.assign({forceCreate: true}, row as VillainData));
          break;
        case 'challenge':
          ctx.state.scene?.addChallenge(row as ChallengeData, true);
          break;
        case 'challenge element':
          const challenge = ctx.state.scene?.challenges.find(x => x.id === (row as ChallengeEntryData).parent);
          if (challenge) challenge.add(row as ChallengeData);
          else {
            console.warn('Could not find the challenge parent for: ', row);
          }
          break;
        case 'location':
          ctx.state.scene?.addLocation(row as LocationData);
          break;
        case 'bonus': 
        case 'penalty':
        case 'defend': {
          const baddie: Baddie = ctx.getters.byID((row as ModifierData).parent);
          if (baddie) {
            baddie.addModifier(row as ModifierData);
          } else {
            console.warn('Could not find the baddie parent for: ', row);
          }
          break;
        }
      }
    });
  }
}

export default actions;

// export enum Actions {
//   initialize="Initialize"
// }

// type ActionsDefinition = {
//   [P in Actions]: Action<State, State>
// }

// interface BaseActionPayloadWithType {
//   type: Actions
// }

// interface Dispatcher {
//   (type: Actions, payload?: any, options?: DispatchOptions): Promise<any>;
//   <P extends BaseActionPayloadWithType>(payloadWithType: P, options?: DispatchOptions): Promise<any>;
// }

// const actions: ActionsDefinition = {
//   [Actions.initialize]: (ctx: ActionContext<State, State>, payload: string) => {
//     if (!ctx.state.initialized) {
//       ctx.commit('INIT');
//     }
//   }
// }

// export { actions, Dispatcher };