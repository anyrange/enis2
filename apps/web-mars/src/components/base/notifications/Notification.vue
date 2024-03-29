<template>
  <div class="notify select-none" :class="notifyClass">
    <div
      v-if="notification.progress && notification.delay"
      :style="progressStyle"
      class="notify-progress"
    />
    <div class="notify-box">
      <span class="notify-message">{{ notification.message }}</span>
      <div v-if="notification.actions">
        <button
          v-for="(action, index) in notification.actions"
          :key="`${action}-${index}`"
          type="button"
          class="notify-action-btn"
          @click="handleAction(action.handler)"
        >
          {{ action.title }}
        </button>
      </div>
      <span
        v-if="notification.closable"
        class="notify-close"
        @click="closeNotification(notification)"
      >
        <icon icon="eva:close-fill" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import Icon from "../Icon.vue"

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(["close-notification"])

const interval = ref(null)
const timeLeft = ref(0)
const speed = ref(100)

const notifyClass = computed(() => {
  const type = props.notification.type
  return {
    "notify-success": type === "success",
    "notify-warning": type === "warning",
    "notify-danger": type === "danger",
    "notify-info": type === "info",
  }
})

const timeLeftPercent = computed(() => {
  return Math.round(
    (((timeLeft.value * 100) / props.notification.delay) * 100) / 100
  )
})

const progressStyle = computed(() => {
  return {
    width: timeLeftPercent.value + "%",
    transition: "width 0.1s linear",
  }
})

onMounted(() => {
  const { delay, progress } = props.notification
  if (delay && progress) {
    timeLeft.value = delay - 100
    interval.value = setInterval(() => updateTime(), speed.value)
  }
})

const closeNotification = (notification) => {
  emit("close-notification", notification)
  destroy()
}

const updateTime = () => {
  timeLeft.value -= speed.value
  if (timeLeft.value === 0) {
    destroy()
  }
}

const handleAction = (action) => {
  action()
  closeNotification()
}

const destroy = () => {
  clearInterval(interval.value)
}
</script>

<style scoped>
.notify {
  @apply relative mt-4 p-2 table rounded text-sm shadow-md drop-shadow-md;
}
.notify-progress {
  @apply absolute bottom-0 left-0 h-1 rounded bg-white bg-opacity-50 z-50;
}
.notify-info {
  @apply bg-q-info text-white;
}
.notify-success {
  @apply bg-q-positive text-white;
}
.notify-warning {
  @apply bg-q-warning text-black;
}
.notify-danger {
  @apply bg-q-negative text-white;
}
.notify-box {
  @apply flex flex-row items-center justify-between;
}
.notify-message {
  @apply pl-2 pr-3;
}
.notify-close {
  @apply rounded-full text-gray-200 justify-center inline-flex duration-150 cursor-pointer p-1 hover:bg-gray-200 hover:bg-opacity-20;
}
.notify-action-btn {
  @apply p-2 rounded-sm uppercase duration-100 hover:bg-white hover:bg-opacity-20 default-focus;
}
</style>
