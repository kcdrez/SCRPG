<template>
  <div class="villain-list">
    <div class="row baddie-list-header">
      <div class="col">
        <h2>
          <a href="#villain-Data" 
             data-toggle="collapse">Villains</a>
        </h2>
        <div class="btn-group btn-group-sm my-auto">
          <button class="btn btn-sm btn-success border-dark" 
                  @click="modal('show')">Create</button>
          <button class="btn btn-primary border-dark"
                    @click="$refs.import.click()"
                    title="Import Villain data from an xlsx file">Import</button>
          <button class="btn btn-secondary border-dark"
                    @click="$store.dispatch('export', {type: 'villains', fileName: 'villains'})"
                    title='Export all Villains to an xlsx file'
                    :disabled="villains.length === 0">Export</button>
        </div>
        <input type="file"
               accept=".xlsx"
               class="d-none"
               ref="import"
               @change="$store.dispatch('import', {files: $event.target.files, filters: ['villains', 'bonus', 'penalty', 'defend']})">        
      </div>
    </div>
    <div id="villain-Data" 
         class="collapse show row">
      <div class="col mb-2" 
           v-if="villains.length === 0">
        There are no Villains.
      </div>
      <div class="col-6 mb-3" 
           v-for="villain in villains" 
           :key="villain.id">
        <div class="card">
          <div class="card-header">
            <input type="text"
                   v-model.trim="villain.tempName"
                   class="form-control form-control-sm d-inline w-50"
                   @keypress.enter="villain.saveEdit()"
                   v-if="villain.editing">
            <h3 class="d-inline"
                v-else>{{villain.name}}</h3>
            <div class="btn-group btn-group-sm float-right">
              <button class="btn btn-secondary border-dark"
                      title="Edit this Villain"
                      @click="villain.beginEdit()"
                      v-if="!villain.editing">Edit</button>
              <button class="btn btn-success border-dark"
                      title="Save edits on this Villain"
                      @click="villain.saveEdit()"
                      v-if="villain.editing">Save</button>
              <button class="btn btn-warning border-dark"
                      title="Cancel edits on this Villain"
                      @click="villain.cancelEdit()"
                      v-if="villain.editing">Cancel</button>
              <button class="btn btn-danger border-dark" 
                      @click="$store.dispatch('removeBaddie', {id: villain.id, type: villain.type})"
                      title="Delete this Villain">Remove</button>
              <button class="btn btn-secondary border-dark"
                      title="Export this Villain to an xlsx file"
                      @click="$store.dispatch('export', {type: 'villains', fileName: 'villains', id: villain.id})">Export</button>
            </div>
          </div>
          <div :id="`villain-${villain.id}`" 
               class="card-body collapse show">
            <div class="text-center">
              <div class="btn-group btn-group-sm w-50">
                <button class="btn btn-success border-dark" 
                        @click="modifyVillain(villain, 'boost')"
                        title="Add a Bonus to this Villain">
                  <img src="images/boost.png">
                </button>
                <button class="btn btn-warning border-dark" 
                        @click="modifyVillain(villain, 'hinder')"
                        title="Add a Penalty to this Villain">
                  <img src="images/hinder.png">
                </button>
                <button class="btn btn-secondary border-dark" 
                        @click="modifyVillain(villain, 'defend')"
                        title="Add a Defend to this Villain">
                  <img src="images/defend.png">
                </button>
                <button class="btn btn-primary border-dark" 
                        @click="$emit('add-minion', villain.id)"
                        title="Add a Minion to this Villain">
                  <span class="fa-stack">
                    <icon :icon="['fas', 'dragon']" 
                           transform="right-4 down-4" />
                    <icon :icon="['fas', 'plus']" 
                           transform="shrink-6 left-4 down-4" />
                  </span>
                </button>
              </div>
            </div>
            <Modifier label="bonus"
                      labelPlural="bonuses"
                      :list="villain.bonuses"
                      :editing="villain.editing"
                      @remove="villain.removeModifier('bonuses', $event)"></Modifier>
            <Modifier label="penalty"
                      labelPlural="penalties"
                      :list="villain.penalties"
                      :editing="villain.editing"
                      @remove="villain.removeModifier('penalties', $event)"></Modifier>
            <Modifier label="defend"
                      labelPlural="defends"
                      :list="villain.defends"
                      :editing="villain.editing"
                      @remove="villain.removeModifier('defends', $event)"></Modifier>          
          </div>
        </div>
      </div>
    </div>
    <div id="createModal-villain" 
         class="modal" 
         tabindex="-1" 
         role="dialog">
      <div class="modal-dialog" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create a Villain</h5>
            <button type="button" 
                    class="close" 
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Name</div>
              </div>
              <input class="form-control" 
                     v-model.trim="name" 
                     type="text"
                     ref="villainName"
                     @keydown.enter="createVillain()">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" 
                    type="button" 
                    data-dismiss="modal"
                    @click="createVillain()">Create</button>
            <button class="btn btn-secondary" 
                    type="button" 
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div id="modifierModal-villain" 
         class="modal" 
         tabindex="-1" 
         role="dialog">
      <div class="modal-dialog" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a {{modifier.type}}</h5>
            <button type="button" 
                    class="close" 
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Name</div>
              </div>
              <input class="form-control" 
                     type="text"
                     v-model.trim="modifier.name"
                     @keydown.enter="target.addModifier(modifier)"
                     ref="modifierName">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">Amount</div>
              </div>
              <input class="form-control" 
                     v-model.number="modifier.amount" 
                     type="number" 
                     :max="modifier.max"
                     :min="modifier.min"
                     @keydown.enter="target.addModifier(modifier)">
            </div>
            <div class="d-inline" 
                 v-if="modifier.type !== 'Defend'">
              <label for="mod-villain-persistent" 
                     class="c-pointer">Persistent?</label>
              <input type="checkbox" 
                     v-model="modifier.persistent"
                     id="mod-villain-persistent">
            </div>
            <div class="d-inline mx-3" 
                 v-if="modifier.type !== 'Defend'">
              <label for="mod-villain-exclusive"
                     class="c-pointer">Exclusive?</label>
              <input type="checkbox" 
                     v-model="modifier.exclusive"
                     id="mod-villain-exclusive">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" 
                    class="btn btn-primary" 
                    @click="target.addModifier(modifier)" 
                    data-dismiss="modal">Add</button>
            <button type="button" 
                    class="btn btn-secondary" 
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {Villain} from '../scripts/baddie';
  import {mapState} from 'vuex';
  import Modifier from './modifier.vue';

  export default {
    name: 'Villains',
    components: {
      Modifier
    },
    data() {
      return {
        name: '',
        target: null,
        modifier: {
          type: '',
          amount: 0,
          max: 0,
          min: 0,
          persistent: false,
          exclusive: false
        }
      }
    },
    computed: {
      ...mapState([
        'villains'
      ])
    },
    methods: {
      createVillain() {
        if (this.name !== '') {
          this.$store.dispatch('upsertBaddie', {name: this.name, type: 'villains'});
          this.modal('hide');
        }
      },
      modifyVillain(villain, type) {
        if (type === 'defend') {
          this.modifier.type = 'Defend';
          this.modifier.max = 100;
          this.modifier.min = 1;
          this.modifier.amount = 1;
        } else if (type ==='boost') {
          this.modifier.max = 4;
          this.modifier.min = 1;
          this.modifier.amount = 1;
          this.modifier.type = 'Bonus';
        } else if (type === 'hinder') {
          this.modifier.max = -1;
          this.modifier.min = -4;
          this.modifier.amount = -1;
          this.modifier.type = 'Penalty';
        } else {
          return;
        }
        this.target = villain;
        $('#modifierModal-villain').modal('show');
        this.$nextTick(() => {
          this.$refs.modifierName.focus();
        }); 
      },
      modal(type) {
        $('#createModal-villain').modal(type);
        if (type === 'show') {
          this.$nextTick(() => {
            this.$refs.villainName.focus();
          }); 
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  
</style>