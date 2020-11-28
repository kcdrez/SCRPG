<template>
  <div class="locations-component">
    <div class="container p-0">
      <div class="row">
        <div class="col">
          <hr class="border-dark">
          <h3>Locations</h3>
          <div class="btn-group btn-group-sm w-50">
              <button class="btn btn-success border-dark"
                      title="Add a new Location to the Scene"
                      @click="addLocationModal">Add</button>
              <button class="btn btn-warning border-dark" 
                      title="Remove all Locations from the Scene"
                      @click="scene.resetLocations()">Clear</button>
              <button class="btn btn-primary border-dark"
                      @click="$refs.import.click()"
                      title="Import Location data from an xlsx file">Import</button>
              <button class="btn btn-secondary border-dark"
                      @click="$store.dispatch('export', {type: 'locations', fileName: scene.name + '_locations'})"
                      title="Export all Locations to an xlsx file"
                      :disabled="scene.locations.length === 0">Export</button>
          </div>
          <input type="file"
                  accept=".xlsx"
                  class="d-none"
                  ref="import"
                  @change="$store.dispatch('import', {files: $event.target.files, filters: ['location']})">
        </div>
      </div>
      <div class="row" >
        <div class="col">
          <div v-if="scene.locations.length === 0"
               class="empty-data">There are no locations.</div>
          <table class="table table-sm table-striped table-bordered table-dark mt-3 mb-0" v-else>
            <thead>
              <tr>
                  <th width="30%">Name</th>
                  <th width="50%">Description</th>
                  <th width="20%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(location, index) in scene.locations" :key="'location' + location.id">
                <td width="30%">
                  <input type="text" 
                          v-model.trim="location.tempName" 
                          v-if="location.editing" 
                          class="form-control form-control-sm"
                          @keypress.enter="location.edit()"
                          :ref="location.id + 'locationName'">
                  <template v-else>{{location.name || '-'}}</template>
                </td>
                <td width="50%">
                  <textarea v-model.trim="location.tempDescription" 
                          v-if="location.editing" 
                          class="form-control form-control-sm"
                          @keypress.enter="location.edit()"
                          :ref="location.id + 'locationDescription'">
                  </textarea>
                  <template v-else>{{location.description || '-'}}</template>
                </td>
                <td width="20%">
                  <div class="btn-group btn-group-sm">
                      <button class="btn btn-primary border-dark"
                              @click="editLocationElement(location, index)"
                              v-if="!location.editing"
                              title="Edit this Location">
                        <icon :icon="['far', 'edit']" />
                      </button>
                      <template v-else>
                      <button class="btn btn-success border-dark" 
                              @click="location.edit()"
                              title="Save changes on this Location">
                        <icon :icon="['far', 'save']" />
                      </button>
                      <button class="btn btn-warning border-dark" 
                              @click="location.editing = false"
                              title="Cancel Editing">
                        <icon :icon="['fas', 'ban']" />
                      </button>
                      </template>
                      <button class="btn btn-danger border-dark" 
                              @click="scene.removeLocation(index)"
                              title="Remove this Location">
                        <icon :icon="['far', 'trash-alt']" />
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
                    ref="locationDescription">
            </textarea>
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
  import {unvue} from '../scripts/utilities';
  import {mapState} from 'vuex';
  import {diff} from 'deep-diff';

  export default {
    name: 'LocationsTracker',
    data() {
      return {
        newLocation: {
          name: '',
          description: ''
        }
      }
    },
    computed: {
      ...mapState([
        'scene'
      ])
    },
    methods: {
      addLocationModal() {
        $("#locationModal").modal('show');
        this.$refs.locationName.focus();
      },
      addLocation() {
        this.scene.addLocation(this.newLocation);
        $("#locationModal").modal('hide');
        this.newLocation.name = '';
        this.newLocation.description = '';
      },
      editLocationElement(location, index) {
        location.beginEdit();
        this.$nextTick(() => {
          this.$refs[location.id + 'locationName'][index].focus();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>