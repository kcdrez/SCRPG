import { v4 as uuid } from "uuid";

import store from "../vuex-state/store";
import { Actor, GenericObject } from "./actor";
import dialog from "./dialog";

class Scene extends Actor {
  constructor(data) {
    data.type = data.type || "scene";
    super(data);
    this.green = data.green || [];
    this.yellow = data.yellow || [];
    this.red = data.red || [];
    this.challenges = (data.challenges || []).map((x) => new Challenge(x));
    this.locations = (data.locations || []).map((x) => new Location(x));
    this.notes = data.notes || "";
  }

  get isEmpty() {
    return (
      this.green.length === 0 &&
      this.yellow.length === 0 &&
      this.red.length === 0
    );
  }

  takenAction() {
    const minions = store.getters.childMinions(this.id);
    const newStatus = !this.acted;
    const minionNotMatched = minions.some((x) => x.acted !== newStatus);
    const message = newStatus
      ? `Some of the environment's minions have not acted. Do you also want to mark all of it's minions as having acted too?`
      : `Some of the environment's minions have already acted. Do you also want to mark it's minions as having not acted?`;
    if (minionNotMatched && minions.length > 0) {
      dialog.confirm({
        title: "Warning",
        body: message,
        onConfirmDialog: () => {
          minions.forEach((minion) => {
            minion.takenAction(newStatus);
          });
        },
      });
    }
    this.acted = newStatus;
    this.save();
  }
  create(green, yellow, red, name) {
    for (let i = 0; i < green; i++) {
      this.green.push({ checked: false });
    }
    for (let i = 0; i < yellow; i++) {
      this.yellow.push({ checked: false });
    }
    for (let i = 0; i < red; i++) {
      this.red.push({ checked: false });
    }
    this.name = name;
    this.save();
  }
  clear(force) {
    if (force) {
      this.green = [];
      this.yellow = [];
      this.red = [];
      this.acted = false;
      this.name = "";
      this.challenges = [];
      this.locations = [];
      this.notes = "";
      this.save();
    } else {
      dialog.confirm({
        body: `Are you sure you want to clear the Scene? All Challenges, Locations, Scene Tracker, and Notes will be removed.`,
        onConfirmDialog: () => {
          this.green = [];
          this.yellow = [];
          this.red = [];
          this.acted = false;
          this.name = "";
          this.challenges = [];
          this.locations = [];
          this.notes = "";
          this.save();
        },
      });
    }
  }
  progressScene(element) {
    element.checked = !element.checked;
    this.save();
  }
  addLocation(location) {
    this.locations.push(new Location(location));
    this.save();
  }
  removeLocation(index) {
    if (index >= 0) {
      dialog.confirm({
        body: `Are you sure you want to remove this location (${this.locations[index].name})?`,
        onConfirmDialog: () => {
          this.locations.splice(index, 1);
          this.save();
        },
      });
    }
  }
  resetLocations() {
    dialog.confirm({
      body: `Are you sure you want to remove all locations?`,
      onConfirmDialog: () => {
        this.locations = [];
        this.save();
      },
    });
  }
  addChallenge(challenge, skipInitialize) {
    this.challenges.push(new Challenge(challenge, skipInitialize));
    this.save();
  }
  removeChallenge(index) {
    if (index >= 0) {
      dialog.confirm({
        body: `Are you sure you want to remove this challenge (${this.challenges[index].name})?`,
        onConfirmDialog: () => {
          this.challenges.splice(index, 1);
          this.save();
        },
      });
    }
  }
  resetChallenges() {
    dialog.confirm({
      body: `Are you sure you want to remove all challenges?`,
      onConfirmDialog: () => {
        this.challenges = [];
        this.save();
      },
    });
  }
  setNote(note) {
    this.notes = note;
    this.save();
  }
  export(challengeId) {
    const minions = store.getters
      .childMinions(this.id)
      .reduce((acc, minion) => {
        const { baddie, modifiers } = minion.export();
        acc.push(baddie);
        acc.push(...modifiers);
        return acc;
      }, []);

    return {
      scene: this.name
        ? {
            id: this.id,
            name: this.name,
            acted: this.acted,
            notes: this.notes,
            green: this.exportSceneTracker(this.green),
            yellow: this.exportSceneTracker(this.yellow),
            red: this.exportSceneTracker(this.red),
            type: this.type,
          }
        : null,
      locations: this.locations.map((x) => x.export()),
      challenges: this.exportChallenges(challengeId),
      envMinions: minions,
    };
  }
  exportSceneTracker(arr) {
    const completed = arr.filter((x) => x.checked).length;
    return `${completed}-${arr.length}`;
  }

  exportChallenges(id) {
    return this.challenges.reduce((acc, challenge) => {
      if (!id || challenge.id === id) {
        acc.push(challenge.export());
        challenge.list.forEach((challengeEl) => {
          acc.push(challengeEl.export(challenge.id));
        });
      }
      return acc;
    }, []);
  }
  import(data) {
    this.clear(true);
    const greens = data.green.split("-");
    const yellows = data.yellow.split("-");
    const reds = data.red.split("-");
    this.create(
      Number(greens[1]),
      Number(yellows[1]),
      Number(reds[1]),
      data.name || "Default Environment"
    );
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
    this.notes = data.notes || "";
    this.id = data.id || this.id;
  }
}

class Challenge extends GenericObject {
  constructor(data, skipInitialize) {
    super(data);
    this.list = (data.list || []).map((x) => new ChallengeEntry(x));
    this.description = data.description || "";
    this.tempDescription = data.tempDescription || this.description;
    this.type = "challenge";
    if (!skipInitialize) this.initialize();
  }

  initialize() {
    if (this.list.length === 0) {
      this.add({ name: `Complete ${this.name}` });
    }
  }
  add(data) {
    if (!data.label && !data.name) return;
    this.list.push(new ChallengeEntry(data));
    this.save();
  }
  remove(index) {
    if (index >= 0) {
      this.list.splice(index, 1);
      this.save();
      if (this.list.length === 0) {
        dialog.confirm({
          title: "No Challenges",
          body: "This Challenge has no elements. Do you want to remove it?",
          onConfirmDialog: () => {
            const thisIndex = store.state.scene.challenges.findIndex(
              (x) => x.id === this.id
            );
            store.state.scene.removeChallenge(thisIndex);
          },
        });
      }
    }
  }
  save() {
    super.save("scene");
  }
  saveEdit() {
    this.description = this.tempDescription;
    super.saveEdit();
  }
  export() {
    return {
      id: this.id,
      name: this.name,
      type: "challenge",
      description: this.description,
      top: this.top,
      left: this.left,
    };
  }
}

class ChallengeEntry extends GenericObject {
  constructor(data) {
    super(data);
    this.completed = data.completed || false;
  }

  complete() {
    this.completed = !this.completed;
    this.save();
  }
  save() {
    super.save("scene");
  }
  export(parent) {
    return {
      name: this.name,
      parent,
      completed: this.completed,
      type: "challenge element",
    };
  }
}

class Location extends GenericObject {
  constructor(data) {
    super(data);
    this.description = data.description || "";
    this.tempDescription = data.tempDescription || data.description || "";
    this.type = "location";
  }

  saveEdit() {
    this.description = this.tempDescription;
    super.saveEdit();
  }
  save() {
    super.save("scene");
  }
  export() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: "location",
      top: this.top,
      left: this.left,
    };
  }
}

export default Scene;
export { Scene, Challenge, Location };
