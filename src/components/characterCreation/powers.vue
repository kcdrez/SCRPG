<template>
  <div class="container">
    <div class="row">
      <div class="col-4 power-source-list">
        <h3 class="text-center">Power Source List</h3>
        <template v-if="guided">
          <button v-if="guided" 
            class="w-100 btn btn-secondary" 
            @click="randomize()">Randomize</button>
          <ul>
            <li v-for="index in random" 
              :title="powerSources[index].description"
              @click="selectPowerSource(powerSources[index])">{{powerSources[index].name}}</li>
          </ul>
        </template>
        <ul v-else>
          <li v-for="source in powerSources" 
            @click="selectPowerSource(source)" :title="source.description">{{source.name}}</li>
        </ul>
      </div>
      <div class="col-8" v-if="character.powerSource">
        <h3 class="text-center">Details</h3>
        <div class="mb-3">
          <h5>Name:</h5>
          <div>{{character.powerSource.name}}</div>
        </div>              
        <div class="mb-3">
          <h5>Description:</h5>
          <div>{{character.powerSource.description}}</div>
        </div>
        <div class="mb-3">
          <h5>Powers</h5>
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
                    <option v-for="die in character.powerOptions(power)" 
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
        <abilities class="mb-3" v-if="abilitiesReady" :character="character" :guided="guided" :abilitiesMap="character.powerSource.abilities"></abilities>           
      </div>
    </div>
  </div>
</template>

<script>
  import {roll, unvue} from '../../scripts/utilities';
  import {powerSources, powers} from '../../assets/powerSources';
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
      }
    },
    data() {
      return {
        powers,
        powerSources,
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
      selectPowerSource(source) {
        if (source) {
          this.character.powerSource = source;
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
          return this.character.powerSource.powers.list.find(x => x === power.name) ||
            this.character.powerSource.powers.categories.find(x => x === power.category);
        })
      },
      abilitiesReady() {
        return this.character.background.powerSource.length === this.character.powers.length;
      }
    }
  };
</script>

<style lang="scss" scoped></style>