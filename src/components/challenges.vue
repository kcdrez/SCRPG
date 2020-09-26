<template>
  <div class="challenges-component">
    <div class="container p-0">
      <div class="row">
        <div class="col">
          <hr class="border-dark">
          <h3>Challenges</h3>
          <div class="btn-group btn-group-sm">
              <button class="btn btn-success border-dark"
                      title="Add a new Challenge to the Scene"
                      @click="addChallengeModal">Add Challenge</button>
              <button class="btn btn-danger border-dark" 
                      title="Remove all Challenges from the Scene"
                      @click="$emit('reset')">Reset Challenges</button>
          </div>
        </div>
      </div>
      <div class="row" 
           v-for="(challenge, challengeIndex) in challenges" 
           :key="challenge.name">
        <div class="col-12 mb-1">
          <div class="text-left mb-1">
            <h5 class="d-inline align-middle m-0">{{challenge.name}}</h5>
            <button class="btn btn-sm btn-danger border-dark mx-1" 
                    title="Remove this Challenge from the Scene" 
                    @click="$emit('remove', challengeIndex)">Remove</button>
          </div>
        </div>
        <div class="col-12">
          <table class="table table-sm table-stripped table-bordered table-dark">
            <thead>
              <tr>
                  <th width="20%">Completed?</th>
                  <th>Description</th>
                  <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, itemIndex) in challenge.list" :key="item.label">
                  <td @click="item.completed = !item.completed" class="h4">
                  <i class="fa fa-check-square-o c-pointer text-success" v-if="item.completed"></i>
                  <i class="fa fa-square-o c-pointer text-danger" v-else></i>
                  </td>
                  <td>
                  <input type="text" 
                          v-model.trim="item.tempLabel" 
                          v-if="item.editing" class="form-control form-control-sm"
                          @keypress.enter="saveChallengeElement(item)"
                          :ref="challengeElementRef(challenge)">
                  <template v-else>{{item.label}}</template>
                  </td>
                  <td>
                  <div class="btn-group btn-group-sm">
                      <button class="btn btn-primary border-dark"
                              @click="editChallengeElement(challenge, item, challengeIndex)"
                              v-if="!item.editing"
                              title="Edit this Challenge Element">
                        <i class="fa fa-pencil-square-o"></i>
                      </button>
                      <template v-else>
                      <button class="btn btn-success border-dark" 
                              @click="saveChallengeElement(item)"
                              title="Save this Challenge Element">
                        <i class="fa fa-floppy-o"></i>
                      </button>
                      <button class="btn btn-secondary border-dark" 
                              @click="item.editing = false"
                              title="Cancel Editing">
                        <i class="fa fa-ban"></i>
                      </button>
                      </template>
                      <button class="btn btn-danger border-dark" 
                              @click="challenge.list.splice(itemIndex, 1)"
                              title="Remove this Challenge Element">
                        <i class="fa fa-trash-o"></i>
                      </button>
                  </div>
                  </td>
              </tr>
              <tr>
                <td colspan="3">
                  <div class="input-group input-group-sm mx-auto my-1 w-50">
                    <input type="text" 
                            class="form-control border-dark" 
                            placeholder="New Challenge Element" 
                            v-model.trim="challenge.newEntry" 
                            @keypress.enter="addChallenge(challenge)">
                    <div class="input-group-append">
                      <button class="btn btn-success border-dark" 
                              type="button"  
                              title="Add a new entry to this Challenge" 
                              @click="addChallenge(challenge)">Add Element</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
                     v-model.trim="challenge.name" 
                     class="form-control" 
                     placeholder="Challenge Name" 
                     @keypress.enter="addChallenge()" 
                     ref="challengeName">
            </div>
            <div>
              <h6>Add some challenge elements (optional)</h6>
              <div class="input-group input-group-sm mb-3">
                <input type="text" 
                       class="form-control border-dark" 
                       placeholder="Challenge Description" 
                       v-model.trim="challenge.description" 
                       @keydown.enter="addTempChallenge">
                <div class="input-group-append">
                  <button class="btn btn-primary border-dark" 
                          type="button" 
                          @click="addTempChallenge" 
                          :disabled="challenge.description === ''">Add</button>
                </div>
              </div>
              <div class="input-group input-group-sm mb-1" 
                   v-for="(item, index) in challenge.list" 
                   :key="'challenge' + index">
                <input type="text" 
                       class="form-control border-dark" 
                       placeholder="Challenge Description" 
                       v-model.trim="item.label">
                <div class="input-group-append">
                  <button class="btn btn-danger border-dark" 
                          type="button" 
                          @click="challenge.list.splice(index, 1)">Remove</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" 
                    type="button" 
                    data-dismiss="modal" 
                    @click="addChallenge()" 
                    :disabled="challenge.name === ''">Save</button>
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
  import {unvue} from '../scripts/utilities.js';

  export default {
    name: 'ChallengesTracker',
    props: {
      challenges: {
        type: Array,
        requires: true
      }
    },
    data() {
      return {
        challenge: {
          name: '',
          description: '',
          list: []
        }
      }
    },
    methods: {
      addChallengeModal() {
        $("#challengeModal").modal('show');
        this.$refs.challengeName.focus();
      },
      addChallenge(challenge) {
        if (challenge && challenge.newEntry) {
          challenge.list.push({
            label: challenge.newEntry,
            tempLabel: challenge.newEntry,
            completed: false,
            editing: false
          });
          challenge.newEntry = '';
        } else if (this.challenge.name !== '') {
          const challengeList = unvue(this.challenge.list);
          if (challengeList.length === 0) {
            challengeList.push({
              label: `Complete ${this.challenge.name}`,
              tempLabel: `Complete ${this.challenge.name}`,
              completed: false,
              editing: false
            });
          }
          this.$emit('add', {
            name: this.challenge.name,
            newEntry: '',
            list: challengeList
          });
          this.challenge.name = '';
          this.challenge.list = [];
          this.challenge.description = '';
          $("#challengeModal").modal('hide');
        }
      },
      addTempChallenge() {
        if (this.challenge.description !== '') {
          this.challenge.list.push({
            label: this.challenge.description,
            tempLabel: this.challenge.description,
            completed: false,
            editing: false
          });
          this.challenge.description = '';
        }
      },
      challengeElementRef(challenge) {
        return challenge.name.replace(/\s/g, '') + 'Element';
      },
      editChallengeElement(challenge, challengeElement, challengeIndex) {
        challengeElement.editing = true;
        this.$nextTick(() => {
          const refName = this.challengeElementRef(challenge);
          this.$refs[refName][challengeIndex].focus();
        });
      },
      saveChallengeElement(item) {
        item.editing = false; 
        item.label = item.tempLabel
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>