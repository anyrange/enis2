<template>
  <modal :show="show" @close="emit('close')">
    <div class="relative overflow-hidden -m-2">
      <random-gif class="w-full h-auto opacity-25" />
      <div
        class="
          absolute
          w-full
          h-auto
          absolute
          top-1/2
          left-1/2
          transform
          -translate-x-1/2 -translate-y-1/2
          text-center
        "
      >
        <p class="text-lg">
          <a
            :href="`https://sms.${school}.nis.edu.kz/`"
            target="_blank"
            class="underline"
            >Оригинальный клиент</a
          >
          &nbsp;не работает
          <span role="img" aria-label="Disappointed Face">😞</span>
        </p>
      </div>
    </div>
  </modal>
</template>

<script setup>
import useSettings from "@/composables/useSettings";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const { school } = useSettings();
</script>
