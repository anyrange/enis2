<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-100 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="show" tabindex="-1" class="fixed inset-0 bg-black/40 z-40">
        <div
          class="fixed inset-0 flex items-center justify-center"
          @click="close"
        >
          <Icon icon="eva:close-fill" class="close-icon" />
          <transition
            enter-active-class="transition ease-out duration-200 transform"
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-100"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-50 translate-y-10 scale-50"
          >
            <div
              v-if="show"
              class="modal-window"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
              @click.stop
            >
              <div class="p-2 max-h-md sm:max-h-xl overflow-y-auto">
                <slot />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue"
import { useScrollLock } from "@vueuse/core"
import Icon from "./Icon.vue"

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["close"])

const isLocked = useScrollLock(document.body)

watch(
  () => props.show,
  (value) => {
    isLocked.value = value
  }
)

const handleKeydown = (e) => {
  if (props.show && e.key === "Escape") {
    close()
  }
}

const close = () => {
  emit("close")
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown)
})
</script>

<style scoped>
.close-icon {
  @apply w-7 h-7 text-gray-500 hover:text-gray-300 rounded-full duration-100 cursor-pointer absolute right-1 top-1;
}
.modal-window {
  @apply bg-white dark:bg-secondary-darkest rounded text-left;
  @apply relative shadow-xl transition-transform align-middle;
  @apply sm:max-w-lg w-full overflow-hidden mr-0 sm:mr-2;
}
</style>
