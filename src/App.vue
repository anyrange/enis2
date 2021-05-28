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

<style lang="scss" src="@/styles/styles.scss"></style>
