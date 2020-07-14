<template>
  <div class="container">
    <div class="row">
      <div class="col-4 bg-list">
        <h3 class="text-center">Background List</h3>
        <template v-if="guided">
          <button class="w-100 btn btn-secondary" 
            @click="randomize([10, 10])">Randomize</button>
          <ul>
            <li v-for="index in random" 
              :title="backgroundList[index].description"
              @click="selectBackground(backgroundList[index])">{{backgroundList[index].name}}</li>
          </ul>
        </template>
        <ul v-else>
          <li v-for="bg in backgroundList" @click="selectBackground(bg)" :title="bg.description">{{bg.name}}</li>
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
          <h5>{{character.qualityMessage}}</h5>
          <table class="table table-sm table-striped table-dark table-bordered">
            <thead class="text-center">
              <tr>
                <th width="15%">Select</th>
                <th width="20%">Name</th>
                <th width="65%">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="quality in character.qualitySelections">
                <td class="text-center">
                  <select class="form-control form-control-sm" 
                    @input="character.adjustQuality(quality, $event.target.value)">
                    <option v-for="die in character.qualityOptions(quality, character.background.qualities.dice)" 
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
      </div>
    </div>
  </div>
</template>

<script>
  import {roll, unvue} from '../../scripts/utilities';
  import backgroundList from '../../assets/backgrounds';

  export default {
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
        backgroundList,
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
      selectBackground(bg) {
        if (bg) {
          this.character.background = bg;
          // this.random.powerSource.dice = bg.powerSource;
          this.$emit('error', null);
          return true;
        } else {
          this.$emit('error', 'You must select a background before continuing.');
          return false;
        }
      },

    }
  };
</script>

<style lang="scss" scoped></style>