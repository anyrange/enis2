<template>
  <q-layout view="lHh Lpr lFf" container style="height: 100vh">
    <router-view />
    <div>
      TEST
    </div>
  </q-layout>
</template>

<script>
import updateNotification from "@/mixins/updateNotification.js";
import themeWatcher from "@/mixins/themeWatcher.js";

export default {
  name: "App",
  mixins: [updateNotification, themeWatcher],
};
</script>
