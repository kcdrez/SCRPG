<template>
  <div class="challenges-component">
    <div class="container p-0">
      <div class="row">
        <div class="col">
          <hr class="border-dark">
          <h3>Challenges</h3>
          <div class="btn-group btn-group-sm w-50">
            <button class="btn btn-success border-dark"
                    title="Add a new Challenge to the Scene"
                    @click="addChallengeModal">Add</button>
            <button class="btn btn-warning border-dark" 
                    title="Remove all Challenges from the Scene"
                    @click="scene.resetChallenges()">Clear</button>
            <button class="btn btn-primary border-dark"
                    @click="$refs.import.click()"
                    title="Import Challenges data from an xlsx file">Import</button>
            <button class="btn btn-secondary border-dark"
                    @click="$store.dispatch('export', {type: 'challenges', fileName: scene.name + '_challenges'})"
                    title="Export all Challenges to an xlsx file"
                    :disabled="scene.challenges.length === 0">Export</button>
          </div>
          <input type="file"
                 accept=".xlsx"
                 class="d-none"
                 ref="import"
                 @change="$store.dispatch('import', {files: $event.target.files, filters: ['challenge', 'challenge element']})">
        </div>
      </div>
      <div class="row"
            v-if="scene.challenges.length === 0">
        <div class="col empty-data">There are no challenges.</div>
      </div>
      <div class="row" 
           v-for="(challenge, challengeIndex) in scene.challenges" 
           :key="challenge.name">
        <div class="col-12 mb-1">
          <div class="text-left my-1">
            <h5 class="d-inline-block align-middle m-0"
                v-if="!challenge.editing">{{challenge.name}}</h5>
            <div :class="challenge.editing ? 'input-group input-group-sm mb-2' : 'd-inline float-right'">
              <input type="text"
                     class="form-control form-control-sm"
                     v-model="challenge.tempName"
                     v-if="challenge.editing">
              <div :class="challenge.editing ? 'input-group-append' : 'btn-group btn-group-sm'">
                <button class="btn btn-sm btn-primary border-dark"
                        title="Edit this Challenge"
                        @click="challenge.beginEdit()"
                        v-if="!challenge.editing">Edit</button>
                <button class="btn btn-sm btn-success border-dark"
                        title="Save this Challenge"
                        @click="challenge.saveEdit()"
                        v-if="challenge.editing">Save</button>
                <button class="btn btn-sm btn-warning border-dark"
                        title="Cancel edits on this Challenge"
                        @click="challenge.cancelEdit()"
                        v-if="challenge.editing">Cancel</button>
                <button class="btn btn-sm btn-danger border-dark" 
                        title="Remove this Challenge from the Scene" 
                        @click="scene.removeChallenge(challengeIndex)">Remove</button>
                <button class="btn btn-secondary border-dark"
                        @click="$store.dispatch('export', {type: 'challenges', 
                          fileName: challenge.name + '_challenges',
                          id: challenge.id})"
                        title="Export this Challenge to an xlsx file">Export</button>
              </div>
            </div>
            <div v-if="!challenge.editing">{{challenge.description}}</div>
            <textarea class="form-control form-control-sm"
                      v-model="challenge.tempDescription"
                      v-else>
            </textarea>
          </div>
        </div>
        <div class="col-12">
          <table class="table table-sm table-striped table-bordered table-dark mb-0">
            <thead>
              <tr>
                  <th width="20%">Completed?</th>
                  <th>Description</th>
                  <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(challengeEntry, itemIndex) in challenge.list" 
                  :key="challengeEntry.name">
                  <td @click="challengeEntry.complete()" 
                      class="h4">
                    <icon :icon="['far', 'check-square']" 
                          v-if="challengeEntry.completed" 
                          class="c-pointer text-success" />
                    <icon :icon="['far', 'square']" 
                           v-else 
                           class="c-pointer text-danger" />
                  </td>
                  <td>
                    <input type="text" 
                            v-model.trim="challengeEntry.tempName" 
                            v-if="challengeEntry.editing" 
                            class="form-control form-control-sm"
                            @keypress.enter="challengeEntry.saveEdit()"
                            :ref="challengeEntry.id">
                    <template v-else>{{challengeEntry.name}}</template>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-primary border-dark"
                                @click="editChallengeEntry(challengeEntry)"
                                v-if="!challengeEntry.editing"
                                title="Edit this Challenge Entry">
                          <icon :icon="['far', 'edit']" />
                        </button>
                        <template v-else>
                        <button class="btn btn-success border-dark" 
                                @click="challengeEntry.saveEdit()"
                                title="Save this Challenge Entry">
                          <icon :icon="['far', 'save']" />
                        </button>
                        <button class="btn btn-warning border-dark" 
                                @click="challengeEntry.cancelEdit()"
                                title="Cancel Editing">
                          <icon :icon="['fas', 'ban']" />
                        </button>
                        </template>
                        <button class="btn btn-danger border-dark" 
                                @click="challenge.remove(itemIndex)"
                                title="Remove this Challenge Entry">
                          <icon :icon="['far', 'trash-alt']" />
                        </button>
                    </div>
                  </td>
              </tr>
              <tr>
                <td colspan="3">
                  <div class="input-group input-group-sm mx-auto my-1 w-50">
                    <input type="text" 
                            class="form-control border-dark" 
                            placeholder="New Challenge Entry" 
                            v-model.trim="newChallenge.name" 
                            @keypress.enter="challenge.add(newChallenge)">
                    <div class="input-group-append">
                      <button class="btn btn-success border-dark" 
                              type="button"  
                              title="Add a new entry to this Challenge" 
                              @click="challenge.add(newChallenge)"
                              :disabled="newChallenge.name === ''">
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
      <hr class="border-dark">
    </div>
    <div id="challengeModal"
         class="modal"
         tabindex="-1"
         role="dialog">
      <div class="modal-dialog"
           role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add a Challenge</h5>
            <button type="button"
                    class="close"
                    data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">Name</span>
              </div>
              <input type="text"
                     v-model.trim="newChallenge.name"
                     class="form-control"
                     placeholder="Challenge Name"
                     @keypress.enter="addChallenge()"
                     ref="challengeName">
            </div>
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">Description</span>
              </div>
              <textarea v-model.trim="newChallenge.description"
                        class="form-control"
                        placeholder="Add a description of the challenge (optional)"
                        @keypress.enter="addChallenge()">
              </textarea>
            </div>
            <div>
              <h6>Add some challenge entries (optional)</h6>
              <div class="input-group input-group-sm mb-3">
                <input type="text"
                       class="form-control border-dark"
                       placeholder="Challenge Entry"
                       v-model.trim="newChallenge.name"
                       @keydown.enter="addTempChallenge">
                <div class="input-group-append">
                  <button class="btn btn-primary border-dark" 
                          type="button" 
                          @click="addTempChallenge" 
                          :disabled="newChallenge.name === ''">Add</button>
                </div>
              </div>
              <div class="input-group input-group-sm mb-1"
                   v-for="(item, index) in newChallenge.list"
                   :key="'challenge' + index">
                <input type="text" 
                       class="form-control border-dark"
                       placeholder="Challenge Entry Description"
                       v-model.trim="item.name">
                <div class="input-group-append">
                  <button class="btn btn-danger border-dark"
                          type="button" 
                          @click="newChallenge.list.splice(index, 1)">Remove</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" 
                    type="button"
                    data-dismiss="modal"
                    @click="addChallenge()"
                    :disabled="newChallenge.name === ''">Save</button>
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
  import Cookies from 'js-cookie';
  import {unvue} from '../scripts/utilities';
  import {Challenge} from '../scripts/scene';
  import {mapState} from 'vuex';

  export default {
    name: 'ChallengesTracker',
    data() {
      return {
        newChallenge: {
          name: '',
          name: '',
          description: '',
          list: []
        }
      }
    },
    computed: {
      ...mapState([
        'scene'
      ])
    },
    methods: {
      addChallengeModal() {
        $("#challengeModal").modal('show');
        this.$refs.challengeName.focus();
      },
      addChallenge(challenge) {
        if (challenge) {
          challenge.add();
        } else if (this.newChallenge.name !== '') {
          this.scene.addChallenge(this.newChallenge);
          this.newChallenge.name = '';
          this.newChallenge.list = [];
          this.newChallenge.name = '';
          $("#challengeModal").modal('hide');
        }
      },
      addTempChallenge() {
        if (this.newChallenge.name !== '') {
          this.newChallenge.list.push({
            name: this.newChallenge.name
          });
          this.newChallenge.name = '';
        }
      },
      editChallengeEntry(entry) {
        entry.beginEdit();
        this.$nextTick(() => {
          this.$refs[entry.id][0].focus();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>