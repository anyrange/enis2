<template>
  <q-layout view="lHh lpr lFf" container style="height: 100vh">
    <router-view />
  </q-layout>
  <update-notification />
</template>

<script>
import UpdateNotification from "@/components/UpdateNotification";

export default {
  name: "App",
  components: {
    UpdateNotification,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");
#app {
  font-family: "Inter", sans-serif;
}
.container {
  width: 100%;
  padding-right: 1rem;
  padding-left: 1rem;
}
.q-tab-panel {
  padding: 0px !important;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 1024px) {
  .lg\:w-1\/3 {
    width: 33.333333%;
  }
}
@media (min-width: 1280px) {
  .xl\:w-1\/4 {
    width: 25%;
  }
}
.w-4 {
  width: 1rem;
}
.h-4 {
  height: 1rem;
}
</style>
