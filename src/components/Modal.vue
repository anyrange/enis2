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
      <div class="absolute inset-0 bg-black bg-opacity-40" v-show="show">
        <div
          @click="close"
          class="fixed inset-0 flex items-center justify-center"
        >
          <transition
            enter-active-class="transition ease-out duration-200 transform"
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-100"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-50 translate-y-10 scale-50"
          >
            <div
              @click.stop
              class="
                relative
                bg-gray-100
                dark:bg-gray-900-spotify
                rounded
                text-left
                overflow-hidden
                shadow-xl
                transform
                transition-all
                align-middle
                sm:max-w-lg
                w-full
                p-2
                mr-0
                sm:mr-2
              "
              role="dialog"
              aria-modal="true"
              v-show="show"
              aria-labelledby="modal-headline"
            >
              <slot></slot>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: "Modal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    close: null,
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    handleKeydown(e) {
      if (this.show && e.key === "Escape") {
        this.close();
      }
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>