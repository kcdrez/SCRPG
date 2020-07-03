class Baddie {
  constructor(name, size, count, types) {
    this.name = name;
    this.types = {
      12: [],
      10: [],
      8: [],
      6: [],
      4: []
    };
    if (size) {
      for (let i = 0; i < count; i++) {
        this.addBaddie(size, [], []);
      }
    } else if (types) {
      this.types = types;
    }
  }

  demote(size, index) {
    const {boosts, hinders} = this.types[size][index];
    this.remove(size, index);
    if (size > 4) {
      this.addBaddie(size - 2, boosts, hinders);
    }
  }
  addBaddie(size, boosts, hinders, count) {
    count = count || 1;
    const match = this.types[size].find(x => {
      return JSON.stringify(boosts) === JSON.stringify(x.boosts) &&
        JSON.stringify(hinders) === JSON.stringify(x.hinders);
    });
    if (match) {
      match.count += count;
    } else {
      this.types[size].push({ boosts, hinders, count});
    }
  }
  remove(size, index) {
    if (this.types[size][index].count === 1) {
      this.types[size].splice(index, 1);
    } else {
      this.types[size][index].count--;
    }
  }
  boost(size, index, amount, name) {
    const {boosts, hinders} = this.types[size][index];
    this.addBaddie(size, boosts.concat({amount, name}), hinders);
    this.remove(size, index);
  }
  hinder(size, index, amount, name) {
    const {boosts, hinders} = this.types[size][index];
    this.addBaddie(size, boosts, hinders.concat({amount, name}));
    this.remove(size, index);
  }
  countBySize(size) {
    return this.types[size].reduce((total, item) => {
      return total + item.count;
    }, 0);
  }
}

export default Baddie;