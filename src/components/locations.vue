<template>
  <div class="locations-component">
    <div class="container p-0">
      <div class="row">
        <div class="col">
          <hr class="border-dark">
          <h3>Locations</h3>
          <div class="btn-group btn-group-sm">
              <button class="btn btn-success border-dark"
                      title="Add a new Challenge to the Scene"
                      @click="addLocationModal">Add Location</button>
              <button class="btn btn-danger border-dark" 
                      title="Remove all Locations from the Scene"
                      @click="$emit('reset')">Reset Locations</button>
          </div>
        </div>
      </div>
      <div class="row" >
        <div class="col">
          <template v-if="locations.length === 0">There are no locations.</template>
          <table class="table table-sm table-stripped table-bordered table-dark" v-else>
            <thead>
              <tr>
                  <th width="30%">Name</th>
                  <th>Description</th>
                  <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(location, index) in locations" :key="'location' + index">
                <td width="30%">
                  <input type="text" 
                          v-model.trim="location.tempName" 
                          v-if="location.editing" 
                          class="form-control form-control-sm"
                          @keypress.enter="saveLocationElement(location)"
                          :ref="locationElementRef(location)">
                  <template v-else>{{location.name || '-'}}</template>
                </td>
                <td width="50%">
                  <textarea v-model.trim="location.tempDescription" 
                          v-if="location.editing" 
                          class="form-control form-control-sm"
                          @keypress.enter="saveLocationElement(location)"
                          :ref="locationElementRef(location)">
                  </textarea>
                  <template v-else>{{location.description || '-'}}</template>
                </td>
                <td width="20%">
                  <div class="btn-group btn-group-sm">
                      <button class="btn btn-primary border-dark"
                              @click="editLocationElement(location, index)"
                              v-if="!location.editing"
                              title="Edit this Location">
                        <i class="fa fa-pencil-square-o"></i>
                      </button>
                      <template v-else>
                      <button class="btn btn-success border-dark" 
                              @click="saveLocationElement(location)"
                              title="Save changes on this Location">
                        <i class="fa fa-floppy-o"></i>
                      </button>
                      <button class="btn btn-secondary border-dark" 
                              @click="location.editing = false"
                              title="Cancel Editing">
                        <i class="fa fa-ban"></i>
                      </button>
                      </template>
                      <button class="btn btn-danger border-dark" 
                              @click="$emit('remove', index)"
                              title="Remove this Location">
                        <i class="fa fa-trash-o"></i>
                      </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div id="locationModal" 
         class="modal" 
         tabindex="-1" 
         role="dialog">
      <div class="modal-dialog" 
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a Location</h5>
            <button type="button" 
                    class="close" 
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h5>Name</h5>
            <input type="text" 
                    v-model.trim="newLocation.name" 
                    class="form-control form-control-sm" 
                    placeholder="Location Name" 
                    @keypress.enter="addLocation()" 
                    ref="locationName">
            <h5>Description</h5>
            <textarea type="text" 
                    v-model.trim="newLocation.description" 
                    class="form-control form-control-sm" 
                    placeholder="Location Description" 
                    @keypress.enter="addLocation()" 
                    ref="locationDescription"></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" 
                    type="button" 
                    data-dismiss="modal" 
                    @click="addLocation()" 
                    :disabled="newLocation.name === ''">Save</button>
            <button class="btn btn-secondary" 
                    type="button" 
                    data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
  import {unvue} from '../scripts/utilities.js';
  import {mapState} from 'vuex';
  import {diff} from 'deep-diff';

  export default {
    name: 'LocationsTracker',
    props: {
      locations: {
        type: Array,
        requires: true
      },
    },
    data() {
      return {
        newLocation: {
          name: '',
          description: ''
        }
      }
    },
    methods: {
      addLocationModal() {
        $("#locationModal").modal('show');
        this.$refs.locationName.focus();
      },
      addLocation() {
        this.$emit('add', {
          name: this.newLocation.name,
          description: this.newLocation.description,
          tempName: this.newLocation.name,
          tempDescription: this.newLocation.description,
          editing: false
        });
        $("#locationModal").modal('hide');
        this.newLocation.name = '';
        this.newLocation.description = '';
      },
      locationElementRef(location) {
        return location.name.replace(/\s/g, '') + 'Element';
      },
      editLocationElement(location, index) {
        location.editing = true;
        this.$nextTick(() => {
          const refName = this.locationElementRef(location);
          this.$refs[refName][index].focus();
        });
      },
      saveLocationElement(location) {
        location.editing = false;
        location.name = location.tempName;
        location.description = location.tempDescription;
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>