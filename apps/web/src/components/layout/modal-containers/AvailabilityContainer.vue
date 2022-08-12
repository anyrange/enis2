<template>
  <figure class="relative overflow-hidden -m-2">
    <Image
      class="w-full h-auto dark:opacity-25"
      :src="getRandomItem(gifs)"
      alt="Service Unavailable"
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
import { getRandomItem } from "../../../utils"
import useSettingsStore from "../../../stores/settings"
import Image from "../../base/Image.vue"

const settingsStore = useSettingsStore()

const gifs = [
  "https://media1.tenor.com/images/e1dc54fe9be616aeca12b3203daafbef/tenor.gif?itemid=19478273",
  "https://c.tenor.com/mGEW9U82igcAAAAC/gus-fring-gustavo.gif",
  "https://c.tenor.com/qBtQ02LLaygAAAAC/kaneki-ken.gif",
  "https://c.tenor.com/GIVLitDIxr8AAAAd/breaking-bad-walter-white.gif",
  "https://c.tenor.com/6Qq-mZ1ZeWoAAAAd/joaquin-joker-joaquin-phoenix.gif",
  "https://c.tenor.com/rrzpWHepmUkAAAAd/dancing-graceful.gif",
  "https://c.tenor.com/VG4AJAHqsbIAAAAd/smirk-ha.gif",
  "https://c.tenor.com/xOP93GYeAy0AAAAC/ryan-gosling-breathing.gif",
  "https://c.tenor.com/ZX95mDnlodwAAAAd/the-rock-sus-eye.gif",
  "https://c.tenor.com/74QM2zVnaiMAAAAd/papich-%D0%BF%D0%B0%D0%BF%D0%B8%D1%87.gif",
  "https://c.tenor.com/JYYenmChz9MAAAAd/papich.gif",
]
</script>
