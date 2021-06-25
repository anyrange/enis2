<template>
  <nav class="flex w-full justify-center">
    <tabs class="mt-6" v-model="selectedPeriod">
      <tab name="1grade">I</tab>
      <tab name="2grade">II</tab>
      <tab name="3grade">III</tab>
      <tab name="4grade">IV</tab>
      <tab name="tabel">Табель</tab>
    </tabs>
  </nav>
  <div @click="logout()">Выход</div>
</template>

<script>
import Tabs from "@/components/Tabs";
import Tab from "@/components/Tab";
import { mapActions } from "vuex";

export default {
  name: "Dashboard",
  components: {
    Tabs,
    Tab,
  },
  data() {
    return {
      selectedPeriod: "1grade",
      loading: true,
    };
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>
