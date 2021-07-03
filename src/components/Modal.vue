<template>
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed z-10 inset-0"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        @click="close"
        class="
          items-end
          justify-center
          pt-4
          px-4
          pb-20
          text-center
          block
          sm:p-0
        "
      >
        <div
          class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span class="inline-block align-middle h-screen" aria-hidden="true"
          >&#8203;</span
        >
        <div
          @click.stop
          class="
            inline-block
            bg-white
            rounded-lg
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
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Deactivate account
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to deactivate your account? All of
                    your data will be permanently removed. This action cannot be
                    undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="close"
              class="
                w-full
                inline-flex
                justify-center
                rounded-md
                border border-gray-300
                shadow-sm
                px-4
                py-2
                bg-white
                text-base
                font-medium
                text-gray-700
                hover:bg-gray-50
                focus:outline-none
                focus:ring-2 focus:ring-indigo-500
                sm:mt-0
                sm:ml-3
                sm:w-auto
                sm:text-sm
              "
            >
              ОК
            </button>
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

<style scoped>
.popup {
  top: 50px;
  padding: 20px;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  z-index: 101;
  background-color: white;
  border-radius: 10px;
}

.popup h1 {
  text-align: center;
  margin: 0;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 100;
}

.footer {
  text-align: right;
}
</style>
