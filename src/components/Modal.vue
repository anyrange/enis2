<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed z-10 inset-0">
      <div @click="close" class="items-end justify-center text-center">
        <div
          class="
            fixed
            inset-0
            bg-gray-700-spotify bg-opacity-50
            transition-opacity
          "
          aria-hidden="true"
        />
        <span class="inline-block align-middle h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div
          @click.stop
          class="
            inline-block
            bg-white
            rounded
            text-left
            overflow-hidden
            shadow-xl
            transform
            transition-all
            sm:my-8
            align-middle
            sm:max-w-lg
            sm:w-full
          "
        >
          <div class="bg-white p-4">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    isOpen: {
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
      if (this.isOpen && e.key === "Escape") {
        this.close();
      }
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
