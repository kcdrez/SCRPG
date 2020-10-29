<template>
  <div v-if="list.length > 0">
    <h6>
      <b class="text-capitalize" 
         :class="textClass">
        {{labelPlural}}:
      </b>
      </h6>
    <div class="border position-relative text-center ml-3" 
        :class="borderClass"
         v-for="(modifier, index) in list" 
         :key="label + index">
      <div class="remove-modifier"
        :title="`Remove this ${label}`"
        @click="$emit('remove', index)">&times;</div>
      <div><b>Name: </b>{{modifier.name}}</div>
      <div>
        <b>Amount: </b>
        {{ amountText(modifier.amount) }}
      </div>
      <div v-if="modifier.persistent" 
           class="font-italic">Persistent</div>
      <div v-if="modifier.exclusive" 
           class="font-italic">Exclusive</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModifierComponent',
    props: {
      label: {
        type: String,
        required: true
      },
      labelPlural: {
        type: String,
        required: true
      },
      list: {
        type: Array,
        required: true
      }
    },
    methods: {
      amountText(amount) {
        if (amount > 0) {
          return `+${amount}`;
        } else {
          return amount;
        }
      }
    },
    computed: {
      borderClass() {
        switch (this.label.toLowerCase()) {
          case 'bonus':
          default:
            return 'border-success';
          case 'penalty':
            return 'border-warning';
          case 'defend':
            return 'border-secondary';
        }
      },
      textClass() {
        switch (this.label.toLowerCase()) {
          case 'bonus':
          default:
            return 'text-success';
          case 'penalty':
            return 'text-dark-warning';
          case 'defend':
            return 'text-secondary';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .remove-modifier {
    position: absolute;
    top: -5px;
    right: 3px;
    cursor: pointer;

    &:hover {
      transform: scale(1.5);
      color: red;
    }
  }
  .text-dark-warning {
    color: #e6ac00;
  }
</style>