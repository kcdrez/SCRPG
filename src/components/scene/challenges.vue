<template>
  <div class="challenges-component">
    <div class="card">
      <div class="card-header text-center">
        <h3>Challenges</h3>
        <div class="btn-group btn-group-sm w-50">
          <button
            class="btn btn-success border-dark"
            title="Add a new Challenge to the Scene"
            @click="$dialog.createActor({ type: 'Challenge' })"
          >
            Add
          </button>
          <button
            class="btn btn-warning border-dark"
            title="Remove all Challenges from the Scene"
            @click="scene.resetChallenges()"
          >
            Clear
          </button>
          <button
            class="btn btn-primary border-dark"
            @click="$refs.import.click()"
            title="Import Challenges data from an xlsx file"
          >
            Import
          </button>
          <button
            class="btn btn-secondary border-dark"
            @click="
              $store.dispatch('export', {
                type: 'challenges',
                fileName: scene.name + '_challenges',
              })
            "
            title="Export all Challenges to an xlsx file"
            :disabled="scene.challenges.length === 0"
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
              filters: ['challenge', 'challenge element'],
            })
          "
        />
      </div>
      <div class="card-body">
        <div v-if="scene.challenges.length === 0" class="text-center">
          There are no challenges in the scene.
        </div>
        <div
          v-for="(challenge, challengeIndex) in scene.challenges"
          :key="challenge.name"
          :id="challenge.elementId"
        >
          <div class="mb-2" v-if="challenge.editing">
            <div class="input-group input-group-sm mb-2">
              <input
                type="text"
                class="form-control border-dark"
                placeholder="Challenge Name"
                v-model.trim="challenge.tempName"
                @keypress.enter="challenge.saveEdit()"
                @keydown.esc="challenge.cancelEdit()"
                ref="challengeNameEdit"
              />
              <button
                class="btn btn-sm btn-success border-dark"
                title="Save this Challenge"
                @click="challenge.saveEdit()"
                :disabled="challenge.tempName === ''"
              >
                Save
              </button>
              <button
                class="btn btn-sm btn-warning border-dark"
                title="Cancel edits on this Challenge"
                @click="challenge.cancelEdit()"
              >
                Cancel
              </button>
              <button
                class="btn btn-sm btn-danger border-dark"
                title="Remove this Challenge from the Scene"
                @click="scene.removeChallenge(challengeIndex)"
              >
                Remove
              </button>
              <button
                class="btn btn-secondary border-dark"
                @click="
                  $store.dispatch('export', {
                    type: 'challenges',
                    fileName: challenge.name + '_challenges',
                    id: challenge.id,
                  })
                "
                title="Export this Challenge to an xlsx file"
              >
                Export
              </button>
            </div>
            <textarea
              class="form-control form-control-sm border-dark"
              v-model.trim="challenge.tempDescription"
              placeholder="Challenge Description"
              @keypress.enter="challenge.saveEdit()"
              @keydown.esc="challenge.cancelEdit()"
            >
            </textarea>
          </div>
          <div class="mb-2" v-else>
            <div class="d-flex justify-content-between">
              <h5 class="m-0 text-capitalize">
                {{ challenge.name }}
              </h5>
              <div class="btn-group btn-group-sm">
                <button
                  class="btn btn-sm btn-primary border-dark"
                  title="Edit this Challenge"
                  @click="editChallenge(challenge, challengeIndex)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-sm btn-danger border-dark"
                  title="Remove this Challenge from the Scene"
                  @click="scene.removeChallenge(challengeIndex)"
                >
                  Remove
                </button>
                <button
                  class="btn btn-secondary border-dark"
                  @click="
                    $store.dispatch('export', {
                      type: 'challenges',
                      fileName: challenge.name + '_challenges',
                      id: challenge.id,
                    })
                  "
                  title="Export this Challenge to an xlsx file"
                >
                  Export
                </button>
              </div>
            </div>
            <div>{{ challenge.description }}</div>
          </div>
          <div>
            <table
              class="table table-sm table-striped table-bordered table-dark text-center mb-0"
            >
              <thead>
                <tr>
                  <th width="20%">Completed?</th>
                  <th>Challenge Entry Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(challengeEntry, itemIndex) in challenge.list"
                  :key="challengeEntry.name"
                >
                  <td @click="challengeEntry.complete()" class="h4">
                    <i
                      class="far fa-check-square c-pointer text-success"
                      v-if="challengeEntry.completed"
                    ></i>
                    <i class="far fa-square c-pointer text-danger" v-else></i>
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model.trim="challengeEntry.tempName"
                      v-if="challengeEntry.editing"
                      class="form-control form-control-sm"
                      placeholder="Challenge Entry Name"
                      @keypress.enter="challengeEntry.saveEdit()"
                      @keydown.esc="challengeEntry.cancelEdit()"
                      :ref="challengeEntry.id"
                    />
                    <template v-else>{{ challengeEntry.name }}</template>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button
                        class="btn btn-primary border-dark"
                        @click="editChallengeEntry(challengeEntry)"
                        v-if="!challengeEntry.editing"
                        title="Edit this Challenge Entry"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <template v-else>
                        <button
                          class="btn btn-success border-dark"
                          @click="challengeEntry.saveEdit()"
                          title="Save this Challenge Entry"
                          :disabled="challengeEntry.tempName === ''"
                        >
                          <i class="fas fa-save"></i>
                        </button>
                        <button
                          class="btn btn-warning border-dark"
                          @click="challengeEntry.cancelEdit()"
                          title="Cancel Editing"
                        >
                          <i class="fas fa-ban"></i>
                        </button>
                      </template>
                      <button
                        class="btn btn-danger border-dark"
                        @click="challenge.remove(itemIndex)"
                        title="Remove this Challenge Entry"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="3">
                    <div class="input-group input-group-sm mx-auto my-1 w-50">
                      <input
                        type="text"
                        class="form-control border-dark"
                        placeholder="New Challenge Entry"
                        v-model.trim="newChallenge.name"
                        @keypress.enter="challenge.add(newChallenge)"
                      />
                      <button
                        class="btn btn-success border-dark"
                        type="button"
                        title="Add a new entry to this Challenge"
                        @click="challenge.add(newChallenge)"
                        :disabled="newChallenge.name === ''"
                      >
                        Add Entry
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChallengesTracker",
  components: {},
  data() {
    return {
      newChallenge: {
        name: "",
      },
    };
  },
  computed: {
    ...mapState(["scene"]),
  },
  methods: {
    editChallenge(challenge, index) {
      challenge.beginEdit();
      this.$nextTick(() => {
        this.$refs.challengeNameEdit[index].focus();
      });
    },
    editChallengeEntry(entry) {
      entry.beginEdit();
      this.$nextTick(() => {
        this.$refs[entry.id][0].focus();
      });
    },
  },
});
</script>

<style lang="scss" scoped></style>
