<template>
  <div class="challenges-component">
    <div class="card">
      <div class="card-header text-center">
        <h3>Challenges</h3>
        <div class="btn-group btn-group-sm w-50">
          <button
            class="btn btn-success border-dark"
            title="Add a new Challenge to the Scene"
            @click="addChallengeModal"
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
          :id="challenge.id"
        >
          <div class="mb-1">
            <div class="text-left my-2">
              <h5
                class="d-inline-block align-middle m-0 text-capitalize"
                v-if="!challenge.editing"
              >
                {{ challenge.name }}
              </h5>
              <div
                :class="
                  challenge.editing
                    ? 'input-group input-group-sm mb-2'
                    : 'd-inline float-right'
                "
              >
                <input
                  type="text"
                  class="form-control form-control-sm border-dark"
                  placeholder="Challenge Name"
                  v-model.trim="challenge.tempName"
                  v-if="challenge.editing"
                  @keypress.enter="challenge.saveEdit()"
                  @keydown.esc="challenge.cancelEdit()"
                  ref="challengeNameEdit"
                />
                <div
                  :class="
                    challenge.editing
                      ? 'input-group-append'
                      : 'btn-group btn-group-sm'
                  "
                >
                  <button
                    class="btn btn-sm btn-primary border-dark"
                    title="Edit this Challenge"
                    @click="editChallenge(challenge, challengeIndex)"
                    v-if="!challenge.editing"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-success border-dark"
                    title="Save this Challenge"
                    @click="challenge.saveEdit()"
                    :disabled="challenge.tempName === ''"
                    v-if="challenge.editing"
                  >
                    Save
                  </button>
                  <button
                    class="btn btn-sm btn-warning border-dark"
                    title="Cancel edits on this Challenge"
                    @click="challenge.cancelEdit()"
                    v-if="challenge.editing"
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
              </div>
              <div v-if="!challenge.editing">{{ challenge.description }}</div>
              <textarea
                class="form-control form-control-sm border-dark"
                v-model.trim="challenge.tempDescription"
                placeholder="Challenge Description"
                @keypress.enter="challenge.saveEdit()"
                @keydown.esc="challenge.cancelEdit()"
                v-else
              >
              </textarea>
            </div>
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
                    <icon
                      :icon="['far', 'check-square']"
                      v-if="challengeEntry.completed"
                      class="c-pointer text-success"
                    />
                    <icon
                      :icon="['far', 'square']"
                      v-else
                      class="c-pointer text-danger"
                    />
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
                        <icon :icon="['far', 'edit']" />
                      </button>
                      <template v-else>
                        <button
                          class="btn btn-success border-dark"
                          @click="challengeEntry.saveEdit()"
                          title="Save this Challenge Entry"
                          :disabled="challengeEntry.tempName === ''"
                        >
                          <icon :icon="['far', 'save']" />
                        </button>
                        <button
                          class="btn btn-warning border-dark"
                          @click="challengeEntry.cancelEdit()"
                          title="Cancel Editing"
                        >
                          <icon :icon="['fas', 'ban']" />
                        </button>
                      </template>
                      <button
                        class="btn btn-danger border-dark"
                        @click="challenge.remove(itemIndex)"
                        title="Remove this Challenge Entry"
                      >
                        <icon :icon="['far', 'trash-alt']" />
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
                      <div class="input-group-append">
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
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div id="challengeModal" class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a Challenge</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text border-dark">Name</span>
              </div>
              <input
                type="text"
                v-model.trim="newChallenge.name"
                class="form-control border-dark"
                placeholder="Challenge Name"
                @keypress.enter="addChallenge()"
                ref="challengeName"
              />
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text border-dark">Description</span>
              </div>
              <textarea
                v-model.trim="newChallenge.description"
                class="form-control border-dark"
                placeholder="Add a description of the challenge (optional)"
                @keypress.enter="addChallenge()"
              >
              </textarea>
            </div>
            <div>
              <h6 class="text-light">Add some challenge entries (optional)</h6>
              <div class="input-group input-group-sm mb-3">
                <input
                  type="text"
                  class="form-control border-dark"
                  placeholder="Challenge Entry"
                  v-model.trim="newChallenge.entry"
                  @keydown.enter="addTempChallenge"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-primary border-dark"
                    type="button"
                    @click="addTempChallenge"
                    :disabled="newChallenge.entry === ''"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div
                class="input-group input-group-sm mb-1"
                v-for="(item, index) in newChallenge.list"
                :key="'challenge' + index"
              >
                <input
                  type="text"
                  class="form-control border-dark"
                  placeholder="Challenge Entry Description"
                  v-model.trim="item.name"
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-danger border-dark"
                    type="button"
                    @click="newChallenge.list.splice(index, 1)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-success border-dark"
              type="button"
              data-dismiss="modal"
              @click="addChallenge()"
              :disabled="newChallenge.name === ''"
            >
              Save
            </button>
            <button
              class="btn btn-secondary border-dark"
              type="button"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { unvue } from "../scripts/utilities";
import { Challenge } from "../scripts/scene";
import { mapState } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChallengesTracker",
  data() {
    return {
      newChallenge: {
        name: "",
        entry: "",
        description: "",
        list: [],
      },
    };
  },
  computed: {
    ...mapState(["scene"]),
  },
  methods: {
    addChallengeModal() {
      $("#challengeModal").modal("show");
      this.$refs.challengeName.focus();
    },
    editChallenge(challenge, index) {
      challenge.beginEdit();
      this.$nextTick(() => {
        this.$refs.challengeNameEdit[index].focus();
      });
    },
    addChallenge(challenge) {
      if (challenge) {
        challenge.add();
      } else if (this.newChallenge.name !== "") {
        this.scene.addChallenge(this.newChallenge);
        this.newChallenge.name = "";
        this.newChallenge.list = [];
        this.newChallenge.name = "";
        $("#challengeModal").modal("hide");
      }
    },
    addTempChallenge() {
      if (this.newChallenge.entry !== "") {
        this.newChallenge.list.push({
          name: this.newChallenge.entry,
        });
        this.newChallenge.entry = "";
      }
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
