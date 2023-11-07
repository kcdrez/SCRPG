import { createStore } from "vuex";
import { v4 as uuid } from "uuid";
import { writeFile, utils } from "xlsx";

import { Baddie, Villain, sameBaddies } from "../scripts/baddie";
import { Player } from "../scripts/player";
import { Scene } from "../scripts/scene";
import { sortActors } from "../scripts/actor";
import { processXlsxFiles } from "../scripts/utilities";

const store = createStore({
  state: {
    initialized: false,
    lieutenants: [],
    minions: [],
    villains: [],
    players: [],
    scene: new Scene({}),
    selection: {
      id: null,
      type: null,
    },
  },
  mutations: {
    INIT(state, { players, minions, lieutenants, villains, scene }) {
      if (players) {
        state.players = players.map((x) => new Player(x));
      }
      if (minions) {
        minions.forEach((minion) => {
          state.minions.push(new Baddie(minion));
        });
      }
      if (lieutenants) {
        state.lieutenants = lieutenants.map((x) => new Baddie(x));
      }
      if (villains) {
        state.villains = villains.map((x) => new Villain(x));
      }
      state.scene = new Scene(scene || {});
      state.initialized = true;
    },
    CREATE_BADDIE(state, baddie) {
      const arr = [...state[baddie.type], baddie];
      state[baddie.type] = arr;
    },
    DELETE_BADDIE(state, { type, index }) {
      state[type].splice(index, 1);
    },
    RESET_BADDIES(state, { type }) {
      state[type] = [];
      console.log(type);
    },
    RESET_ENVIRONMENT(state) {
      state.minions = [];
      state.lieutenants = [];
      state.villains = [];
      state.scene.clear(true);
    },
    RESET_ROUND(state) {
      state.minions.forEach((x) => x.resetRound());
      state.lieutenants.forEach((x) => x.resetRound());
      state.villains.forEach((x) => x.resetRound());
      state.players.forEach((x) => x.resetRound());
      state.scene.resetRound();
    },
    ADD_PLAYER(state, playerData) {
      state.players.push(new Player(playerData));
    },
    REMOVE_PLAYER(state, id) {
      const index = state.players.findIndex((x) => x.id === id);
      if (index > -1) {
        state.players.splice(index, 1);
      }
    },
    SELECT_CANVAS_EL(state, data) {
      state.selection.id = data?.id || null;
      state.selection.type = data?.actorType || null;
    },
  },
  actions: {
    async initialize(ctx) {
      if (!ctx.state.initialized) {
        const minions = JSON.parse(
          window.localStorage.getItem("minions") || "[]"
        );
        const lieutenants = JSON.parse(
          window.localStorage.getItem("lieutenants") || "[]"
        );
        const villains = JSON.parse(
          window.localStorage.getItem("villains") || "[]"
        );
        const players = JSON.parse(
          window.localStorage.getItem("players") || "[]"
        );
        const scene = JSON.parse(window.localStorage.getItem("scene") || "{}");

        ctx.commit("INIT", { minions, lieutenants, villains, players, scene });
      }
    },
    saveData(ctx, saveData) {
      const type = typeof saveData === "string" ? saveData : saveData.type;
      const data = typeof saveData === "string" ? null : saveData.data;
      if (!type) return;
      else if (type in ctx.rootState) {
        const dataToSave = ctx.rootState[type];
        if (data && data.id) {
          dataToSave.forEach((x) => {
            if (x.id === data.id) {
              x = data;
            }
          });
        }
        window.localStorage.setItem(type, JSON.stringify(dataToSave));
      }
    },
    resetEnvironment(ctx) {
      ctx.commit("RESET_ENVIRONMENT");
      ctx.dispatch("saveData", "minions");
      ctx.dispatch("saveData", "lieutenants");
      ctx.dispatch("saveData", "villains");
      ctx.dispatch("saveData", "scene");
    },
    resetRound(ctx) {
      ctx.commit("RESET_ROUND");
    },
    resetScene(ctx) {
      ctx.commit("RESET_SCENE");
    },
    upsertBaddie(ctx, baddieData) {
      const baddie =
        baddieData.type === "villains"
          ? new Villain(baddieData)
          : new Baddie(baddieData);
      ctx.commit("CREATE_BADDIE", baddie);
      ctx.dispatch("saveData", baddieData.type);
    },
    modifyBaddie(ctx, { modifier, type }) {
      const match = ctx.state[type].find((x) => x.id === modifier.targetId);
      if (match) {
        match.addModifier(modifier);
      }
    },
    removeBaddie(ctx, { id, type }) {
      const index = ctx.state[type].findIndex((x) => x.id === id);
      if (index >= 0) {
        ctx.commit("DELETE_BADDIE", { type, index });
        ctx.dispatch("saveData", type);
      }
    },
    resetBaddies(ctx, { type }) {
      ctx.commit("RESET_BADDIES", { type });
      ctx.dispatch("saveData", type);
    },
    addPlayer(ctx, playerData) {
      if (!playerData.id) {
        playerData.id = uuid();
      }

      if (!ctx.state.players.find((x) => x.id === playerData.id)) {
        ctx.commit("ADD_PLAYER", playerData);
        ctx.dispatch("saveData", "players");
      }
    },
    removePlayer(ctx, id) {
      ctx.commit("REMOVE_PLAYER", id);
      ctx.dispatch("saveData", "players");
    },
    resetPlayers(ctx) {
      ctx.commit("RESET_BADDIES", { type: "players" });
      ctx.dispatch("saveData", "players");
    },
    export(ctx, options) {
      const { type, fileName, id } = options || {};
      const rows = [];
      const { scene, challenges, locations, envMinions } =
        ctx.state.scene.export(id);
      if (type === "scene" || !type) {
        if (scene) rows.push(scene);
        rows.push(...envMinions);
      }
      if (type === "challenges" || !type) {
        rows.push(...challenges);
      }
      if (type === "locations" || !type) {
        rows.push(...locations);
      }
      if (type === "players" || !type) {
        ctx.state.players.forEach((x) => {
          const { player, minions } = x.export();
          rows.push(
            player,
            ...minions.filter((minion) => {
              return !rows.find((row) => row.id === minion.id);
            })
          );
        });
      }
      if (type === "villains" || !type) {
        ctx.state.villains.forEach((x) => {
          const { baddie, modifiers, minions } = x.export();
          rows.push(
            baddie,
            ...modifiers,
            ...minions.filter((minion) => {
              return !rows.find((row) => row.id === minion.id);
            })
          );
        });
      }
      if (type === "lieutenants" || !type) {
        ctx.state.lieutenants.forEach((x) => {
          const { baddie, modifiers } = x.export();
          rows.push(baddie, ...modifiers);
        });
      }
      if (type === "minions" || !type) {
        ctx.state.minions.forEach((minion) => {
          if (!rows.find((row) => row.id === minion.id)) {
            const { baddie, modifiers } = minion.export();
            rows.push(baddie, ...modifiers);
          }
        });
      }

      const wb = utils.book_new();
      const sceneWS = utils.json_to_sheet(rows);

      utils.book_append_sheet(wb, sceneWS, "SCRPG");

      writeFile(wb, (fileName || "SCRPG-GM") + ".xlsx");
    },
    async import(ctx, data) {
      const { files, filters } = data;
      if (!files) return;
      (await processXlsxFiles(files, filters)).forEach((row) => {
        if (!row.type) return;
        switch (row.type.toLowerCase()) {
          case "player":
          case "players":
            ctx.dispatch("addPlayer", row);
            break;
          case "scene":
          case "environment":
            ctx.state.scene.import(row);
            break;
          case "minion":
          case "minions":
          case "lieutenant":
          case "lieutenants":
          case "villain":
          case "villains":
            ctx.dispatch("upsertBaddie", row);
            break;
          case "challenge":
            ctx.state.scene.addChallenge(row, true);
            break;
          case "challenge element":
            const challenge = ctx.state.scene.challenges.find(
              (x) => x.id === row.parent
            );
            if (challenge) challenge.add(row);
            else {
              console.warn("Could not find the challenge parent for: ", row);
            }
            break;
          case "location":
            ctx.state.scene.addLocation(row);
            break;
          case "bonus":
          case "penalty":
          case "defend": {
            const baddie = ctx.getters.byID(row.parent);
            if (baddie) {
              baddie.addModifier(row);
            } else {
              console.warn("Could not find the baddie parent for: ", row);
            }
            break;
          }
        }
      });
    },
    moveObject(ctx, data) {
      if (data.id && data.actorType) {
        let match = null;
        switch (data.actorType) {
          case "player":
            match = ctx.state.players.find((player) => player.id === data.id);
            break;
          case "minion":
            match = ctx.state.minions.find((minion) => minion.id === data.id);
            break;
          case "lieutenant":
            match = ctx.state.lieutenants.find(
              (lieutenant) => lieutenant.id === data.id
            );
            break;
          case "villain":
            match = ctx.state.villains.find(
              (villain) => villain.id === data.id
            );
            break;
          case "location":
            match = ctx.state.scene.locations.find(
              (location) => location.id === data.id
            );
            break;
          case "challenge":
            match = ctx.state.scene.challenges.find(
              (challenge) => challenge.id === data.id
            );
            break;
        }

        if (match) {
          match.top = data.top;
          match.left = data.left;
          match.angle = data.angle;
          match.scaleX = data.scaleX;
          match.scaleY = data.scaleY;
          match.save();
        }
      }
    },
    selectObject(ctx, data) {
      ctx.commit("SELECT_CANVAS_EL", data);
    },
  },
  getters: {
    byID: (state) => (id) => {
      return [
        ...state.players,
        ...state.villains,
        ...state.minions,
        ...state.lieutenants,
        state.scene,
      ].find((entry) => entry.id === id);
    },
    childMinions: (state) => (id) => {
      return state.minions.filter(
        (minion) => minion.owner && minion.owner.id === id
      );
    },
    actors: (state) => {
      let arr = [];
      if (state.scene.name) arr.push(state.scene);

      const envMinions = state.minions.filter((m) =>
        m.owner ? m.owner.id === state.scene.id : false
      );
      arr.push(...envMinions);

      state.players.sort(sortActors).forEach((player) => {
        arr.push(player);
        const minions = state.minions.filter((m) =>
          m.owner ? m.owner.id === player.id : false
        );
        arr = arr.concat(minions);
      });

      state.villains.sort(sortActors).forEach((villain) => {
        arr.push(villain);
        const minions = state.minions.filter((m) =>
          m.owner ? m.owner.id === villain.id : false
        );
        arr = arr.concat(minions);
      });

      const remainingMinions = state.minions.filter((m) => {
        const match = arr.find((x) => x.id === m.id);
        return !match;
      });

      return arr.concat(state.lieutenants, remainingMinions);
    },
    locations: (state) => {
      return state.scene.locations;
    },
    challenges: (state) => {
      return state.scene.challenges;
    },
  },
});

export default store;
