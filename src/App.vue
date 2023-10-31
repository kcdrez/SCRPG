<template>
  <div>
    <navbar />
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import navbar from "./components/navbar.vue";

export default defineComponent({
  name: "App",
  components: { navbar },
});
</script>

<style></style>
