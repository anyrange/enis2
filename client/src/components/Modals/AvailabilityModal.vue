<template>
  <figure class="relative overflow-hidden -m-2">
    <base-img
      class="w-full h-auto dark:opacity-25"
      :src="randomGIF.src"
      :alt="randomGIF.name"
      height="500"
      width="500"
    />
    <figcaption
      class="absolute w-full h-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
    >
      <div class="text-lg text-white">
        <a
          :href="`https://sms.${settingsStore.settings.school}.nis.edu.kz/`"
          target="_blank"
          class="underline underline-offset-3 decoration-1 decoration-wavy decoration-red-500"
        >
          Оригинальный клиент (СУШ)
        </a>
        не работает
        <span role="img" aria-label="Disappointed Face">😞</span>
      </div>
    </figcaption>
  </figure>
</template>

<script setup>
import useSettingsStore from "@/stores/settings";
import useRandom from "@/composables/useRandom";

const { randomGIF } = useRandom();
const settingsStore = useSettingsStore();
</script>
