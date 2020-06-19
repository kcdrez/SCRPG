<template>
  <div>
    <div class="method-select">
      <button class="btn" 
        title="I don't have an idea for my hero and/or I feel overwhelmed and want to limit my options to prevent analysis paralysis" 
        @click="guided = true" 
        :class="[guided ? 'btn-primary': 'btn-secondary']">Guided</button>
      <button class="btn" 
        title="I already have an idea for my hero and/or I want to see all the available options" 
        @click="guided = false"
        :class="[guided ? 'btn-secondary': 'btn-primary']">Constructed</button>
    </div>
    <form-wizard>
      <tab-content title="Background" :before-change="validateBackground" class="select-background">
        <h1 class="text-center">Choose a Background</h1>
        <h4 v-if="error" class="text-danger text-center">{{error}}</h4>
        <div class="container">
          <div class="row">
            <div class="col-4 bg-list">
              <h3 class="text-center">Background List</h3>
              <template v-if="guided">
                <button v-if="guided" 
                  class="w-100 btn btn-secondary" 
                  @click="randomize('background')">Randomize</button>
                <ul>
                  <li v-for="index in random.background.selected" 
                    :title="backgrounds[index].description"
                    @click="selectBackground(backgrounds[index])">{{backgrounds[index].name}}</li>
                </ul>
              </template>
              <ul v-else>
                <li v-for="bg in backgrounds" @click="selectBackground(bg)" :title="bg.description">{{bg.name}}</li>
              </ul>
            </div>
            <div class="col-8" v-if="character.background">
              <h3 class="text-center">Details</h3>
              <div class="mb-3">
                <h5>Name:</h5>
                <div>{{character.background.name}}</div>
              </div>              
              <div class="mb-3">
                <h5>Description:</h5>
                <div>{{character.background.description}}</div>
              </div>
              <div class="mb-3">
                <h5>Principle:</h5>
                <div>{{character.background.principle}}</div>
              </div> 
              <div class="mb-3">
                <h5>{{qualitiesData.diceText}}</h5>
                <table class="table table-sm table-striped table-dark table-bordered">
                  <thead class="text-center">
                    <tr>
                      <th width="15%">Select</th>
                      <th width="20%">Name</th>
                      <th width="65%">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="quality in qualitiesData.list">
                      <td class="text-center">
                        <select @change="" class="form-control form-control-sm">
                          <option :value="-1"
                            @click="addQuality(quality, -1)">-</option>
                          <option v-for="die in qualitiesData.availableDice" 
                            :value="die.id"
                            :disabled="die.disabled"
                            @click="addQuality(quality, die.id, die.dieSize)">{{die.dieSize}}</option>
                        </select>
                      </td>
                      <td class="text-center">{{quality.name}}</td>
                      <td>{{quality.description}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>                           
            </div>
          </div>
        </div>
      </tab-content>
      <tab-content title="Power Source" :before-change="selectPowerSource">
          <h1 class="text-center">Choose a Power Source</h1>
          <h4 v-if="error" class="text-danger text-center">{{error}}</h4>
          <div class="container">
            <div class="row">
              <div class="col-4 power-source-list">
                <h3 class="text-center">Power Source List</h3>
                <template v-if="guided">
                  <button v-if="guided" 
                    class="w-100 btn btn-secondary" 
                    @click="randomize('powerSource')">Randomize</button>
                  <ul>
                    <li v-for="index in random.powerSource.selected" 
                      :title="powers[index].description"
                      @click="details.powerSource = powers[index]">{{powers[index].name}}</li>
                  </ul>
                </template>
                <ul v-else>
                  <li v-for="source in powers" @click="details.powerSource = source" :title="source.description">{{source.name}}</li>
                </ul>
              </div>
              <div class="col-8" v-if="details.powerSource">
                <h3 class="text-center">Details</h3>
                <div class="mb-3">
                  <h5>Name:</h5>
                  <div>{{details.powerSource.name}}</div>
                </div>              
                <div class="mb-3">
                  <h5>Description:</h5>
                  <div>{{details.powerSource.description}}</div>
                </div>
                <div class="mb-3">
                  <h5>Abilities</h5>
                  <div v-if="'green' in details.powerSource.abilities">
                    Select {{details.powerSource.abilities.green.count}} from the following Green Abilities:
                    <table class="table table-sm table-striped table-dark table-bordered">
                      <thead class="text-center">
                        <tr>
                          <th width="15%">Action(s)</th>
                          <th width="15%">Name</th>
                          <th width="15%">Type</th>
                          <th width="55%">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="ability in details.powerSource.abilities.green.list">
                          <td class="text-center">{{ability.actions.join(', ')}}</td>
                          <td class="text-center">{{ability.name}}</td>
                          <td class="text-center">{{ability.type}}</td>
                          <td>{{ability.description}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-if="'yellow' in details.powerSource.abilities">
                    Select {{details.powerSource.abilities.yellow.count}} from the following Yellow Abilities:
                    <table class="table table-sm table-striped table-dark table-bordered">
                      <thead class="text-center">
                        <tr>
                          <th width="15%">Action(s)</th>
                          <th width="15%">Name</th>
                          <th width="15%">Type</th>
                          <th width="55%">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="ability in details.powerSource.abilities.yellow.list">
                          <td class="text-center">{{ability.actions.join(', ')}}</td>
                          <td class="text-center">{{ability.name}}</td>
                          <td class="text-center">{{ability.type}}</td>
                          <td>{{ability.description}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>                  
                </div>             
              </div>
            </div>
          </div>
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
  import archetypes from '../assets/archetypes';
  import personalities from '../assets/personalities';
  import powers from '../assets/powers';
  import redAbilities from '../assets/redAbilities';
  import backgrounds from '../assets/backgrounds';
  import qualities from '../assets/qualities';

  export default {
    name: 'Home',
    data() {
      return {
        archetypes,
        personalities,
        powers,
        redAbilities,
        backgrounds,
        qualities,
        character: {
          background: null,
          powerSource: null,
          qualities: []
        },
        details: {
          background: null,
          powerSource: null
        },
        error: null,
        guided: false,
        random: {
          background: {
            dice: [10, 10],
            selected: []
          },
          powerSource: {
            dice: [],
            selected: []
          }          
        }
      }
    },
    methods: {
      selectBackground(bg) {
        if (bg) {
          this.character.background = bg;
          this.random.powerSource.dice = bg.powerSource;
          this.error = null;
          return true;
        } else {
          this.error = 'You must select a background before continuing.';
          return false;
        }
      },
      validateBackground() {
        const selected = this.selectBackground(this.character.background);
        if (selected) {
          if (this.character.qualities.length !== this.character.background.qualities.dice.length) {
            this.error = 'You must assign all of your quality dice.';
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      },
      selectPowerSource() {

      },
      addQuality(quality, id, dieSize) {
        console.log(JSON.parse(JSON.stringify(quality)), id, dieSize);
        if (id < 0) {
          const index = this.character.qualities.findIndex(x => x.name === quality.name);
          if (index >= 0) this.character.qualities.splice(index, 1);
        } else {
          const match = this.qualitiesData.availableDice.find(x => x.id === id);
          if (match) {
            this.character.qualities.push(Object.assign({id, dieSize}, quality));
          } else {
            console.error(quality, id);
            alert('No quality match');
          }
        }
      },     
      randomize(property) {
        if (property in this.random) {
          let selected = [];
          this.random[property].dice.forEach(dieSize => {
            const roll = this.roll(dieSize);
            if (selected.length > 0) {
              let sums = [];
              selected.forEach(x => {
                sums.push(x + roll);
              })
              selected = selected.concat(sums);
            }
            selected.push(roll);
          })
          selected = selected.filter((item, index) => {
            return selected.indexOf(item) === index && item < 20;
          }).sort((a, b) => {
            if (a > b) return 1;
            else if (b > a) return -1;
            else return 0;
          });
          this.random[property].selected = selected;
        } else {
          console.log(property, this.random);
          alert(`${property} is not in the random object`);
        }
      },
      roll(dieSize) {
        return Math.floor(Math.random() * dieSize);
      }
    },
    computed: {
      qualitiesData() {
        const {dice, list, categories} = this.character.background.qualities;
        const mapped = dice.map(x => `d${x}`);
        const diceText = `Assign a ${mapped.join(' and a ')} to ${mapped.length} of these qualities:`;
        let fullList = [];
        categories.forEach(c => {
          fullList = fullList.concat(this.qualities[c.toLowerCase()]);
        })
        list.forEach(l => {
          let match = this.qualities.information.find(x => x.name.toLowerCase() === l.toLowerCase());
          if (!match) {
            match = this.qualities.mental.find(x => x.name.toLowerCase() === l.toLowerCase());
          }
          if (!match) {
            match = this.qualities.physical.find(x => x.name.toLowerCase() === l.toLowerCase());
          }
          if (!match) {
            match = this.qualities.social.find(x => x.name.toLowerCase() === l.toLowerCase());
          }
          if (match) {
            fullList.push(match);
          } else {
            console.log(l);
            alert('couldnt find a match');
          }
        })
        fullList = fullList.reduce((acc, x) => {
          const match = acc.find(y => x.name === y.name);
          if (!match) acc.push(x);
          return acc;
        }, []);

        const availableDice = dice.reduce((acc, dieSize, index) => {
          let disabled = Boolean(this.character.qualities.find(x => x.id === index));
          acc.push({
            id: index,
            dieSize,
            disabled
          })
          return acc;
        }, []);
        return {
          diceText,
          list: fullList,
          availableDice
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    margin: 0;
    max-width: 100%;
  }
  .method-select {
    text-align: center;

    button {
      font-size: 2rem;
      margin: 0.5rem 1rem;
    }
  }
  .bg-list, .power-source-list {
    ul {
      padding: 0;

      li {
        cursor: pointer;
        border-radius: 5px;
        list-style-type: none;
        padding: 0 5px;
        text-align: center;

        &:hover {
          background-color: #007bff;
          color: white;
        }
      }
    }
  }
</style>