<template>
  <div>
    <h5>Abilities</h5>
    <div v-for="(data, color) in abilitiesMap">
      Select {{data.count}} from the following {{color}} Abilities:
      <table class="table table-sm table-striped table-dark table-bordered" 
        :class="`${color}-abilities`">
        <thead class="text-center">
          <tr>
            <th width="15%">Selections</th>
            <th width="15%">Action(s)</th>
            <th width="15%">Name</th>
            <th width="15%">Type</th>
            <th width="40%">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ability in data.list">
            <td class="text-center align-middle">
              <select class="form-control form-control-sm" v-if="character.abilityOptions(ability, data, color).selection1"
                @input="character.selectAbility(ability, data, color, $event.target.value, 'selection1')">
                <option v-for="option in character.abilityOptions(ability, data, color).selection1" 
                  :value="option.value"
                  :disabled="option.disabled">{{option.value}}</option>
              </select>
              <input type="checkbox" v-else 
                @change="character.selectAbility(ability, data, color, 'selected', 'selection1')"
                :disabled="character.disabledAbility(data, color, ability)">
              <select class="form-control form-control-sm" v-if="character.abilityOptions(ability, data, color).selection2"
                @input="character.selectAbility(ability, data, color, $event.target.value, 'selection2')">
                <option v-for="option in character.abilityOptions(ability, data, color).selection2" 
                  :value="option.value" 
                  :disabled="option.disabled">{{option.value}}</option>
              </select>
            </td>
            <td class="text-center">{{ability.actions.length > 0 ? ability.actions.join(', '): '-'}}</td>
            <td class="text-center">{{ability.name}}</td>
            <td class="text-center">{{ability.type}}</td>
            <td>{{ability.display || ability.description}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {roll, unvue} from '../../scripts/utilities';
  import {powerSources, powers} from '../../assets/powerSources';

  export default {
    props: {
      guided: {
        type: Boolean,
        required: true
      },
      character: {
        type: Object,
        required: true
      },
      abilitiesMap: {
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
            this.character.powerSource.powers.categories.find(x => x === power.category);;
        })
      },
      abilitiesReady() {
        return this.character.background.powerSource.length === this.character.powers.length;
      }
    }
  };
</script>

<style lang="scss" scoped></style>