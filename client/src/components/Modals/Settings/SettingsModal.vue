<template>
  <div class="flex flex-col space-y-4 p-2">
    <div class="flex flex-col space-y-2">
      <span class="text-lg">Настройки</span>
      <div class="flex justify-between items-center">
        <span> Темная тема </span>
        <div>
          <base-switch id="darkTheme" v-model="darkTheme" />
        </div>
      </div>
    </div>
    <div class="flex flex-col space-y-2">
      <span class="text-lg">Журнал</span>
      <div class="flex justify-between items-center">
        <span> Скрыть пустые </span>
        <div>
          <base-switch id="hideEmpty" v-model="settings.hideEmpty" />
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span> Сортировать </span>
        <div>
          <base-select v-model="settings.sortBy" :options="SORT_OPTIONS" />
        </div>
      </div>
    </div>
    <div class="flex flex-col space-y-2 !mb-2">
      <span
        class="block text-lg leading-10 cursor-pointer flex justify-between border-b dark:border-secondary-darker border-secondary-lightest items-center"
        @click="showAdvanced = !showAdvanced"
      >
        Advanced
        <icon
          :icon="
            showAdvanced
              ? 'ic:round-keyboard-arrow-up'
              : 'ic:round-keyboard-arrow-down'
          "
          class="w-4 h-4"
        />
      </span>
      <suspense v-if="showAdvanced">
        <async-slider />
      </suspense>
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
    <div class="flex flex-col">
      <span class="text-lg">Links</span>
      <div class="flex items-center space-x-3">
        <a class="settings-link underline" :href="GH_LINK" target="_blank">
          repo
        </a>
        <a class="settings-link underline" :href="TG_LINK" target="_blank">
          chat
        </a>
      </div>
      <div class="flex flex-col mt-2">
        <span class="text-lg"> Donate with Kaspi </span>
        <div class="flex items-center gap-1">
          <p>+7 708 153 26 34 <span class="p-1 text-sm">Александр Т.</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.settings-link {
  @apply hover:underline;
}
</style>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { GH_LINK, TG_LINK } from "@/config";
import useSettingsStore from "@/stores/settings";
import useAuthStore from "@/stores/auth";

const AsyncSlider = defineAsyncComponent(() =>
  import("./SettingsModalSlider.vue")
);

const SORT_OPTIONS = [
  {
    value: "score",
    label: "По процентам",
  },
  {
    value: "name",
    label: "По алфавиту",
  },
];

const settingsStore = useSettingsStore();
const { logout } = useAuthStore();

const showAdvanced = ref(false);

const { settings, darkTheme } = storeToRefs(settingsStore);
</script>
