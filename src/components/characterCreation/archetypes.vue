<template>
  <div class="container">
    <div class="row">
      <div class="col-4 power-source-list">
        <h3 class="text-center">Archetype List</h3>
        <template v-if="guided">
          <button v-if="guided"
            class="w-100 btn btn-secondary" 
            @click="randomize()">Randomize</button>
          <ul>
            <li v-for="index in random" 
              :title="archetypes[index].description"
              @click="selectArchetype(archetypes[index])">{{archetypes[index].name}}</li>
          </ul>
        </template>
        <ul v-else>
          <li v-for="arch in archetypes" 
            @click="selectArchetype(arch)" :title="arch.description">{{arch.name}}</li>
        </ul>
      </div>
      <div class="col-8" v-if="character.archetype">
        <h3 class="text-center">Details</h3>
        <div class="mb-3">
          <h5>Name:</h5>
          <div>{{character.archetype.name}}</div>
        </div>              
        <div class="mb-3">
          <h5>Description:</h5>
          <div>{{character.archetype.description}}</div>
        </div>
        <div class="mb-3">
          <h5>Powers</h5>
          <div>Assign one or more dice to the following powers:</div>
          <table class="table table-sm table-striped table-dark table-bordered">
            <thead class="text-center">
              <tr>
                <th width="15%">Select</th>
                <th width="20%">Name</th>
                <th width="20%">Category</th>
                <th width="45%">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="power in availablePowers">
                <td class="text-center align-middle">
                  <select class="form-control form-control-sm" 
                    @input="character.selectPower(power, $event.target.value)">
                    <option v-for="die in character.archetypeDice(power)" 
                      :value="die.id" 
                      :disabled="die.disabled">{{die.dieSize}}</option>
                  </select>
                </td>
                <td class="text-center align-middle">{{power.name}}</td>
                <td class="text-center align-middle">{{power.category}}</td>
                <td>{{power.description}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mb-3">
          <h5>Qualities</h5>
          <div>Assign any remaining dice to any of the following qualities:</div>
          <table class="table table-sm table-striped table-dark table-bordered">
            <thead class="text-center">
              <tr>
                <th width="15%">Select</th>
                <th width="20%">Name</th>
                <th width="65%">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quality in availableQualities">
                <td class="text-center">
                  <select class="form-control form-control-sm" 
                    @input="character.adjustQuality(quality, $event.target.value)">
                    <option v-for="die in character.archetypeDice(quality, 'quality')" 
                      :value="die.id" 
                      :disabled="die.disabled">{{die.dieSize}}</option>
                  </select>
                </td>
                <td class="text-center">{{quality.name}}</td>
                <td>{{quality.description}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <abilities class="mb-3" v-if="abilitiesReady" 
          :character="character" 
          :guided="guided" 
          :abilitiesMap="character.archetype.abilities"></abilities>
      </div>
    </div>
  </div>
</template>

<script>
  import {roll, unvue} from '../../scripts/utilities';
  import archetypes from '../../assets/archetypes';
  import {powers} from '../../assets/powerSources';
  import qualities from '../../assets/qualities';
  import abilities from './abilities.vue';

  export default {
    components: {abilities},
    props: {
      guided: {
        type: Boolean,
        required: true
      },
      character: {
        type: Object,
        required: true
      },
      archivedPowers: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        archetypes,
        random: []
      }
    },
    methods: {
      randomize(dice) {
        let selected = [];
        dice.forEach(dieSize => {
          const result = roll(dieSize);
          if (selected.length > 0) {
            let sums = [];
            selected.forEach(x => {
              sums.push(x + result);
            })
            selected = selected.concat(sums);
          }
          selected.push(result);
        })
        selected = selected.filter((item, index) => {
          return selected.indexOf(item) === index && item < 20;
        }).sort((a, b) => {
          if (a > b) return 1;
          else if (b > a) return -1;
          else return 0;
        });
        this.random = selected;
      },
      selectArchetype(arch) {
        if (arch) {
          this.character.archetype = arch;
          this.$emit('error', null);
          return true;
        } else {
          this.$emit('error', 'You must select a Power Source before continuing.');
          return false;
        }
      }
    },
    computed: {
      availablePowers() {
        return powers.filter(power => {
          return (this.character.archetype.powers.list.find(x => x === power.name) ||
            this.character.archetype.powers.categories.find(x => x === power.category) &&
            !this.archivedPowers.find(x => x.name === power.name));
        })
      },
      availableQualities() {
       const {list, categories} = this.character.archetype.qualities;
        let fullList = categories.reduce((acc, c) => {
          return acc.concat(qualities[c.toLowerCase()]);
        }, []);
        list.forEach(l => {
          let match = qualities.information.find(x => x.name.toLowerCase() === l.toLowerCase());
          if (!match) {
            match = qualities.mental.find(x => x.name.toLowerCase() === l.toLowerCase());
          }
          if (!match) {
            match = qualities.physical.find(x => x.name.toLowerCase() === l.toLowerCase());
          }
          if (!match) {
            match = qualities.social.find(x => x.name.toLowerCase() === l.toLowerCase());
          }
          if (match) {
            fullList.push(match);
          } else {
            console.error(l);
            alert('couldnt find a match');
          }
        });
        return fullList.reduce((acc, x) => {
          const match = acc.find(y => x.name === y.name);
          if (!match) acc.push(x);
          return acc;
        }, []);
      },
      archetypeList() {
        return [];
        // return archetypes.filter(arch => {
        //   return this.character.powerSource.powers.list.find(x => x === power.name) ||
        //     this.character.powerSource.powers.categories.find(x => x === power.category);;
        // })
      },
      abilitiesReady() {
        return this.character.background.powerSource.length === this.character.powers.length;
      }
    },
    created() {
      console.log('meow')
    }
  };
</script>

<style lang="scss" scoped></style>