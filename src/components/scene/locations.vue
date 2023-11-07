<template>
  <div class="locations-component">
    <div class="card">
      <div class="card-header text-center">
        <h3>Locations</h3>
        <div class="btn-group btn-group-sm w-50">
          <button
            class="btn btn-success border-dark"
            title="Add a new Location to the Scene"
            @click="$dialog.createActor({ type: 'Location' })"
          >
            Add
          </button>
          <button
            class="btn btn-warning border-dark"
            title="Remove all Locations from the Scene"
            @click="scene.resetLocations()"
          >
            Clear
          </button>
          <button
            class="btn btn-primary border-dark"
            @click="$refs.import.click()"
            title="Import Location data from an xlsx file"
          >
            Import
          </button>
          <button
            class="btn btn-secondary border-dark"
            @click="
              $store.dispatch('export', {
                type: 'locations',
                fileName: scene.name + '_locations',
              })
            "
            title="Export all Locations to an xlsx file"
            :disabled="scene.locations.length === 0"
          >
            Export
          </button>
        </div>
        <input
          type="file"
          accept=".xlsx"
          class="d-none"
          ref="import"
          @change="
            $store.dispatch('import', {
              files: $event.target.files,
              filters: ['location'],
            })
          "
        />
      </div>
      <div class="card-body">
        <div v-if="scene.locations.length === 0" class="text-center">
          There are no locations.
        </div>
        <table
          class="table table-sm table-striped table-bordered table-dark text-center mt-3 mb-0"
          v-else
        >
          <thead>
            <tr>
              <th width="30%">Name</th>
              <th width="50%">Description</th>
              <th width="20%">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(location, index) in scene.locations"
              :key="'location' + location.id"
              :id="location.elementId"
            >
              <td width="30%">
                <input
                  type="text"
                  v-model.trim="location.tempName"
                  v-if="location.editing"
                  class="form-control form-control-sm border-dark"
                  @keypress.enter="location.saveEdit()"
                  @keydown.esc="location.cancelEdit()"
                  :ref="location.id + 'locationName'"
                />
                <template v-else>{{ location.name || "-" }}</template>
              </td>
              <td width="50%">
                <textarea
                  v-model.trim="location.tempDescription"
                  v-if="location.editing"
                  class="form-control form-control-sm border-dark"
                  @keypress.enter="location.saveEdit()"
                  @keydown.esc="location.cancelEdit()"
                  :ref="location.id + 'locationDescription'"
                >
                </textarea>
                <template v-else>{{ location.description || "-" }}</template>
              </td>
              <td width="20%">
                <div class="btn-group btn-group-sm">
                  <button
                    class="btn btn-primary border-dark"
                    @click="editLocationElement(location, index)"
                    v-if="!location.editing"
                    title="Edit this Location"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <template v-else>
                    <button
                      class="btn btn-success border-dark"
                      @click="location.saveEdit()"
                      :disabled="location.tempName === ''"
                      title="Save changes on this Location"
                    >
                      <i class="fas fa-save"></i>
                    </button>
                    <button
                      class="btn btn-warning border-dark"
                      @click="location.editing = false"
                      title="Cancel Editing"
                    >
                      <i class="fas fa-ban"></i>
                    </button>
                  </template>
                  <button
                    class="btn btn-danger border-dark"
                    @click="scene.removeLocation(index)"
                    title="Remove this Location"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "LocationsTracker",
  computed: {
    ...mapState(["scene"]),
  },
  methods: {
    editLocationElement(location, index) {
      location.beginEdit();
      this.$nextTick(() => {
        this.$refs[location.id + "locationName"][index].focus();
      });
    },
  },
});
</script>

<style lang="scss" scoped></style>
