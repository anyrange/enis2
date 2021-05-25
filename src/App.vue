<template>
  <div id="q-app">
    <q-layout>
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
    <update-notification />
  </div>
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
