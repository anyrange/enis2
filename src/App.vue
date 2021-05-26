<template>
  <div id="q-app">
    <q-layout>
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
    <update-notification />
    <cookie-law theme="blood-orange--rounded"></cookie-law>
  </div>
</template>

<script>
import UpdateNotification from "@/components/UpdateNotification";
import CookieLaw from "vue-cookie-law";

export default {
  name: "App",
  components: {
    UpdateNotification,
    CookieLaw,
  },
};
</script>

<style lang="scss" src="@/styles/styles.scss"></style>
