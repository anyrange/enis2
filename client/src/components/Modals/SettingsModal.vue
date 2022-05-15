<template>
  <div class="flex flex-col space-y-4 p-2">
    <div class="flex flex-col space-y-2">
      <span class="text-lg">Настройки</span>
      <div class="flex justify-between items-center">
        <span class="settings-label"> Темная тема </span>
        <div>
          <base-switch id="darkTheme" v-model="darkTheme" />
        </div>
      </div>
    </div>
    <div class="flex flex-col space-y-2">
      <span class="text-lg">Журнал</span>
      <div class="flex justify-between items-center">
        <span class="settings-label"> Скрыть пустые </span>
        <div>
          <base-switch id="hideEmpty" v-model="settings.hideEmpty" />
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span class="settings-label"> Сортировать </span>
        <div>
          <base-select v-model="settings.sortBy" :options="SORT" />
        </div>
      </div>
    </div>
    <div>
      <base-button
        v-if="settings.rememberMe"
        color="negative"
        rounded
        @click="logout()"
      >
        Выйти
      </base-button>
    </div>
    <div class="flex flex-col space-y-2">
      <span class="text-lg">Links</span>
      <div class="flex items-center space-x-3">
        <a class="settings-link" :href="GH_LINK" target="_blank"> repo </a>
        <a class="settings-link" :href="TG_LINK" target="_blank"> chat </a>
        <a class="settings-link" :href="DA_LINK" target="_blank"> donate </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { DA_LINK, GH_LINK, TG_LINK } from "@/config";
import { useAuth, useSettings } from "@/store";

const SORT = [
  {
    value: "score",
    label: "По процентам",
  },
  {
    value: "name",
    label: "По алфавиту",
  },
];

const settingsStore = useSettings();
const { logout } = useAuth();

const { settings, darkTheme } = storeToRefs(settingsStore);
</script>
