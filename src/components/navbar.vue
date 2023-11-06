<template>
  <nav
    class="navbar navbar-expand-lg navbar-light border-bottom border-dark px-3"
  >
    <router-link :to="{ name: 'home' }" class="navbar-brand">Home</router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbar-toggler"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbar-toggler">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <div class="nav-link c-pointer" @click="toggleOvercomeDialog(true)">
            Overcome Chart
          </div>
        </li>
        <li class="nav-item">
          <div class="nav-link c-pointer" @click="toggleBoostDialog(true)">
            Boost/Hinder Chart
          </div>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
          >
            Data
          </a>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#" @click="$refs.import.click()">
                Import
              </a>
              <input
                type="file"
                accept=".xlsx"
                class="d-none"
                ref="import"
                @change="
                  $store.dispatch('import', { files: $event.target.files })
                "
              />
            </li>
            <li>
              <a
                class="dropdown-item"
                href="#"
                @click="$store.dispatch('export')"
              >
                Export
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="navbar-text">
      <small>Version: {{ version }}</small>
    </div>
  </nav>
</template>

<script>
import { defineComponent } from "vue";
import { mapActions } from "vuex";

import config from "../../package.json";

export default defineComponent({
  name: "NavBar",
  data() {
    return {
      version: config.version,
    };
  },
  methods: {
    ...mapActions(["toggleBoostDialog", "toggleOvercomeDialog"]),
  },
});
</script>

<style lang="scss" scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 5;
}
</style>
