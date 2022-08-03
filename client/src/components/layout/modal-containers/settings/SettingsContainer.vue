<template>
  <div class="flex flex-col space-y-4 p-2">
    <div class="flex flex-col space-y-2">
      <span class="text-lg">Настройки</span>
      <div class="flex justify-between items-center">
        <span> Темная тема </span>
        <div>
          <Switch id="darkTheme" v-model="darkTheme" />
        </div>
      </div>
    </div>
    <div class="flex flex-col space-y-2">
      <span class="text-lg">Журнал</span>
      <div class="flex justify-between items-center">
        <span> Скрыть пустые </span>
        <div>
          <Switch id="hideEmpty" v-model="settings.hideEmpty" />
        </div>
      </div>
      <div class="flex justify-between items-center">
        <span> Сортировать </span>
        <div>
          <Select v-model="settings.sortBy" :options="SORT_OPTIONS" />
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
        <SettingsContainerSlider />
      </suspense>
    </div>
    <div>
      <Button
        v-if="settings.rememberMe"
        color="negative"
        rounded
        @click="logout()"
      >
        Выйти
      </Button>
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

<style>
.settings-link {
  @apply hover:underline;
}
</style>

<script setup>
import { ref, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { DA_LINK, GH_LINK, TG_LINK } from "../../../../config";
import useSettingsStore from "../../../../stores/settings";
import useAuthStore from "../../../../stores/auth";
import Icon from "../../../base/Icon.vue";
import Switch from "../../../base/Switch.vue";
import Button from "../../../base/Button.vue";
import Select from "../../../base/Select.vue";

const SettingsContainerSlider = defineAsyncComponent(() =>
  import("./SettingsContainerSlider.vue")
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
