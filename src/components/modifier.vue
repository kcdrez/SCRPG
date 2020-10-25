<template>
  <div v-if="list.length > 0">
    <h6><b class="text-capitalize">{{labelPlural}}:</b></h6>
    <div class="border border-dark position-relative text-center ml-3" 
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
    };
  }
</style>