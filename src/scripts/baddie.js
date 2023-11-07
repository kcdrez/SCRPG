import store from "store/store";
import { Actor, Modifier } from "./actor";
import dialog from "./dialog";

class Baddie extends Actor {
  constructor(data) {
    super(data);
    this._owner = data.owner || data._owner || data.parent || null;
    this.tempOwner = this._owner;
    this.size = data.size || 12;
    this.tempSize = this.size;
    this.bonuses = data.bonuses ? data.bonuses.map((x) => new Modifier(x)) : [];
    this.penalties = data.penalties
      ? data.penalties.map((x) => new Modifier(x))
      : [];
    this.defends = data.defends ? data.defends.map((x) => new Modifier(x)) : [];

    const maxIndex = store.state[data.type].reduce((maxIndex, baddie) => {
      if (baddie.index >= maxIndex && data.name === baddie.name) {
        return baddie.index + 1;
      }
      return maxIndex;
    }, 1);

    this.index = maxIndex;
  }

  get owner() {
    return store.getters.byID(this._owner);
  }
  get allowEdit() {
    return !this.editing;
  }
  get displayName() {
    let text = `${this.name}`;
    text += this.index ? `-${this.index}` : "";
    text += this.owner ? ` (${this.owner.name})` : "";
    return text;
  }
  get allowRemove() {
    return true;
  }

  demote() {
    if (this.size > 4) {
      this.changeSize(this.size - 2);
    }
  }
  promote() {
    if (this.size < 12) {
      this.changeSize(this.size + 2);
    }
  }
  changeSize(newSize) {
    this.size = newSize;
    this.save();
  }
  addModifier(modifierData) {
    if (!modifierData.name) return;

    switch (modifierData.type.toLowerCase()) {
      case "bonus":
        this.bonuses.push(new Modifier(modifierData));
        this.sortModifiers(this.bonuses);
        break;
      case "penalty":
        this.penalties.push(new Modifier(modifierData));
        this.sortModifiers(this.penalties);
        break;
      case "defend":
        this.defends.push(new Modifier(modifierData));
        this.sortModifiers(this.defends);
        break;
    }
  }
  removeModifier(type, index) {
    this[type].splice(index, 1);
    this.save();
  }
  takenAction(status) {
    this.acted = status === undefined ? !this.acted : status;
    this.save();
  }
  export() {
    return {
      baddie: {
        name: this.name,
        type: this.type,
        parent: this._owner,
        id: this.id,
        size: this.size,
        acted: this.acted,
        top: this.top,
        left: this.left,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        angle: this.angle,
      },
      modifiers: [
        ...this.bonuses.map((x) => x.export(this.id)),
        ...this.penalties.map((x) => x.export(this.id)),
        ...this.defends.map((x) => x.export(this.id)),
      ],
    };
  }
  saveEdit() {
    this._owner = this.tempOwner;
    this.size = this.tempSize;
    this.bonuses.forEach((b) => b.saveEdit());
    this.penalties.forEach((p) => p.saveEdit());
    this.defends.forEach((d) => d.saveEdit());
    super.saveEdit();
  }
  remove() {
    dialog.confirm({
      body: `Are you sure you want to remove this ${this.type} (${this.displayName})?`,
      onConfirmDialog: () => {
        store.dispatch("removeBaddie", { id: this.id, type: this.type });
      },
    });
  }
}

class Villain extends Actor {
  constructor(data) {
    super(data);
    this.bonuses = data.bonuses ? data.bonuses.map((x) => new Modifier(x)) : [];
    this.penalties = data.penalties
      ? data.penalties.map((x) => new Modifier(x))
      : [];
    this.defends = data.defends ? data.defends.map((x) => new Modifier(x)) : [];
  }

  get allowAddMinion() {
    return true;
  }
  get allowEdit() {
    return true;
  }

  addModifier(modifierData) {
    if (!modifierData.name) return;

    switch (modifierData.type.toLowerCase()) {
      case "bonus":
        this.bonuses.push(new Modifier(modifierData));
        this.sortModifiers(this.bonuses);
        break;
      case "penalty":
        this.penalties.push(new Modifier(modifierData));
        this.sortModifiers(this.penalties);
        break;
      case "defend":
        this.defends.push(new Modifier(modifierData));
        this.sortModifiers(this.defends);
        break;
    }
  }
  removeModifier(type, index) {
    const remove = () => {
      this[type].splice(index, 1);
      this.save();
    };

    if (this[type][index].exclusive || this[type][index].persistent) {
      dialog.confirm({
        body: `This ${type} is persistent and/or exclusive. Are you sure you want to remove it?`,
        onConfirmDialog: () => {
          remove();
        },
      });
    } else {
      remove();
    }
  }
  takenAction() {
    const minions = store.getters.childMinions(this.id);
    const newStatus = !this.acted;
    const minionNotMatched = minions.some((x) => x.acted !== newStatus);
    const message = newStatus
      ? `Some of this villain's minions have not acted. Generally, all minions act at the start of the turn. Do you also want to mark all of their minions as having acted too?`
      : `Some of this villain's minions have already acted. Do you also want to mark their minions as having not acted?`;
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
  export() {
    const minions = store.getters
      .childMinions(this.id)
      .reduce((acc, minion) => {
        const { baddie, modifiers } = minion.export();
        acc.push(baddie);
        acc.push(...modifiers);
        return acc;
      }, []);

    return {
      baddie: {
        id: this.id,
        name: this.name,
        type: this.type,
        acted: this.acted,
      },
      modifiers: [
        ...this.bonuses.map((x) => x.export(this.id)),
        ...this.defends.map((x) => x.export(this.id)),
        ...this.penalties.map((x) => x.export(this.id)),
      ],
      minions,
    };
  }
  saveEdit() {
    this.bonuses.forEach((b) => b.saveEdit());
    this.penalties.forEach((p) => p.saveEdit());
    this.defends.forEach((d) => d.saveEdit());
    super.saveEdit();
  }
  remove() {
    dialog.confirm({
      body: `Are you sure you want to remove this ${this.type} (${this.name})?`,
      onConfirmDialog: () => {
        store.dispatch("removeBaddie", { id: this.id, type: this.type });
      },
    });
  }
}

function sameBaddies(baddie1, baddie2) {
  return (
    baddie1.name === baddie2.name &&
    JSON.stringify(baddie1.bonuses) === JSON.stringify(baddie2.bonuses) &&
    JSON.stringify(baddie1.penalties) === JSON.stringify(baddie2.penalties) &&
    JSON.stringify(baddie1.defends) === JSON.stringify(baddie2.defends) &&
    baddie1.size === baddie2.size
  );
}

export { Baddie, Villain, sameBaddies };
