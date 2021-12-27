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
      <div v-show="show" class="fixed inset-0 bg-black bg-opacity-40">
        <div
          class="fixed inset-0 flex items-center justify-center"
          @click="close"
        >
          <svg
            class="close-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            @click="close"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
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
              <div class="absolute right-0 top-0">
                <slot name="top-right"> </slot>
              </div>
              <div class="p-2 max-h-xl overflow-y-auto">
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
import { computed, onMounted, onBeforeUnmount } from "vue";
import useDocument from "@/composables/useDocument";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const { toggleClass } = useDocument();

toggleClass(
  computed(() => props.show),
  "modal-opened"
);

const handleKeydown = (e) => {
  if (props.show && e.key === "Escape") {
    close();
  }
};

const close = () => {
  emit("close");
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.close-icon {
  @apply w-6 h-6 text-gray-500 hover:text-gray-300 rounded-full duration-100 cursor-pointer absolute right-1 top-1;
}
.modal-window {
  @apply bg-gray-100 dark:bg-gray-900-spotify rounded text-left;
  @apply relative shadow-xl transition-transform align-middle;
  @apply sm:max-w-lg w-full overflow-hidden mr-0 sm:mr-2;
}
</style>
