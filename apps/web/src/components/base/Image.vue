<template>
  <img
    class="border-transparent relative"
    :class="[loaded ? 'select-none' : 'animate-pulse']"
    aria-hidden="false"
    draggable="false"
    loaded="lazy"
    :src="imageUrl"
    :alt="alt"
    v-bind="$attrs"
  />
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
})

const loaded = ref(false)
const imageUrl = ref("")

const checkImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(url)
    img.onerror = () => reject("Failed to load image")
  })
}

const handleImage = async () => {
  try {
    imageUrl.value = await checkImage(props.src)
    loaded.value = true
  } catch (err) {
    loaded.value = false
  }
}

watch(() => props.src, handleImage, { immediate: true })
</script>

<style>
img:-moz-broken {
  opacity: 0;
}
img::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  @apply dark:bg-secondary-dark bg-gray-200;
}
</style>
