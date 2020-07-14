<template>
  <div class="character-creation">
    <navbar />
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
        <background :guided="guided" :character="character"
          @error="error = $event" ref="bg"></background>
      </tab-content>
      <tab-content title="Power Source" :before-change="validatePowerSource">
          <h1 class="text-center">Choose a Power Source</h1>
          <h4 v-if="error" class="text-danger text-center">{{error}}</h4>
          <powers :guided="guided" :character="character" ref="powers"
            @error="error = $event"></powers>
      </tab-content>
      <tab-content title="Archetype" :before-change="validateArchetype">
        <h1 class="text-center">Choose an Archetype</h1>
        <h4 v-if="error" class="text-danger text-center">{{error}}</h4>
        <archetypes :guided="guided" :character="character" ref="archetypes"
          @error="error = $event" :archivedPowers="archivedPowers"></archetypes>
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
  import Character from '../scripts/character';
  import {unvue} from '../scripts/utilities';
  import background from '../components/characterCreation/background.vue';
  import powers from '../components/characterCreation/powers.vue';
  import archetypes from '../components/characterCreation/archetypes.vue';

  export default {
    name: 'CharacterCreation',
    components: {background, powers, archetypes},
    data() {
      return {
        character: new Character(),
        error: null,
        guided: false,
        archivedPowers: []
      }
    },
    methods: {
      validatePowerSource() {
        const selected = this.$refs.powers.selectPowerSource(this.character.powerSource);
        if (selected) {
          if (this.character.validPowerSource) {
            this.archivedPowers = unvue(this.character.powers);
            return true;
          } else {
            this.error = 'You must select all of your abilities.';
            return false;
          }
        } else {
          return false;
        }
      },
      validateBackground() {
        const selected = this.$refs.bg.selectBackground(this.character.background);
        if (selected) {
          if (this.character.validBackground) {
            return true;
          } else {
            this.error = 'You must assign all of your quality dice.';
            return false;
          }
        } else {
          return false;
        }
      },
      validateArchetype() {
        return true;
      }
    },
    computed: {
    },
    watch: {

    }
  };
</script>

<style lang="scss">
  .character-creation {
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
    .green-abilities {
      thead {
        background-color: #345f34;
      }
      tbody {
        tr {
          background-color: #2e902e;
        }
        tr:nth-of-type(2n+1) {
          background-color: #34aa34;
        }
      }
    }
    .yellow-abilities {
      thead {
        background-color: #8f9737;
      }
      tbody {
        tr {
          background-color: #bfcc2a;
          color: black;
        }
        tr:nth-of-type(2n+1) {
          background-color: #e4f523;
        }
      }
    }  
    select {
      option {
        &:disabled {
          background-color: lightgray;
          color: white;
        }
      }
    }
  }
</style>