<template>
  <modal :show="show" @close="emit('close')">
    <div class="flex flex-col space-y-4 p-2">
      <div class="flex flex-col space-y-2">
        <span class="text-lg">Настройки</span>
        <div class="flex justify-between items-center">
          <span class="settings-label"> Темная тема </span>
          <div>
            <base-switch id="darkTheme" v-model="darkTheme" />
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="settings-label"> Текущая четверть </span>
          <div>
            <base-select v-model="actualTermName" :options="TERMS" />
          </div>
        </div>
      </div>
      <div class="flex flex-col space-y-2">
        <span class="text-lg">Журнал</span>
        <div class="flex justify-between items-center">
          <span class="settings-label"> Скрыть пустые </span>
          <div>
            <base-switch id="hideEmpty" v-model="hideEmpty" />
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="settings-label"> Сортировать </span>
          <div>
            <base-select v-model="sortBy" :options="SORT" />
          </div>
        </div>
      </div>
      <div>
        <base-button v-if="rememberMe" color="negative" @click="logout()">
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
  </modal>
</template>

<script setup>
import { DA_LINK, GH_LINK, TG_LINK } from "@/config";
import useSettings from "@/composables/useSettings";
import useAuth from "@/composables/useAuth";
import useSubject from "@/composables/useSubject";
import useTerms from "@/composables/useTerms";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

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

const TERMS = [
  {
    value: "1",
    label: "Первая",
  },
  {
    value: "2",
    label: "Вторая",
  },
  {
    value: "3",
    label: "Третья",
  },
  {
    value: "4",
    label: "Четвертая",
  },
];

const emit = defineEmits(["close"]);

const { rememberMe, darkTheme, sortBy, hideEmpty } = useSettings();
const { actualTermName } = useTerms();
const { GM } = useSubject();
const { logout } = useAuth();
</script>
