<template>
  <div
    tabindex="0"
    class="
      rounded
      shadow
      bg-white
      dark:bg-gray-800-spotify
      appearance-none
      default-focus
    "
    :class="[
      [
        hoverable
          ? 'cursor-pointer hover:bg-gray-200 hover:bg-opacity-10 dark:hover:bg-gray-700-spotify'
          : 'cursor-default select-text',
      ],
      { 'opacity-50 pointer-events-none	': !subject?.Evaluations?.length },
    ]"
    @click="emit('click')"
    @keyup.enter="emit('click')"
  >
    <div v-if="subject" class="space-y-2 p-2">
      <h3 class="flex text-base font-medium truncate">
        {{ subject.Name }}
      </h3>
      <div class="flex justify-between">
        <p>
          <span class="item-title">
            {{ scoreDecimals.before }}
          </span>
          <span v-show="scoreDecimals.after" class="item-subtitle"
            >.{{ scoreDecimals.after }}
          </span>
          <span class="item-subtitle">%</span>
        </p>
        <p>
          <span class="item-subtitle">оценка </span>
          <span class="item-title">{{ subject.Mark }}</span>
        </p>
      </div>
    </div>
    <div
      :class="barClass"
      class="rounded-b-md dark:bg-opacity-10 bg-opacity-20"
    >
      <div
        class="h-1 rounded-bl-md"
        style="transition: width 0.3s ease-in-out, color 0.1s ease"
        :style="barStyle"
        :class="barClass"
      />
    </div>
  </div>
</template>

<script setup>
import { getPercentDecimals } from "@/utils";
import { computed } from "vue";

const props = defineProps({
  subject: {
    type: Object,
    required: true,
  },
  hoverable: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(["click"]);

const scoreDecimals = computed(() => getPercentDecimals(props.subject.Score));

const barClass = computed(() => {
  const roundedScore = Math.round(props.subject.Score);
  if (roundedScore >= 85) return "bg-q-positive";
  if (roundedScore >= 65) return "bg-q-warning";
  return "bg-q-negative";
});

const barStyle = computed(() => {
  return {
    width: props.subject.Score + "%",
  };
});
</script>

<style scoped>
.item-title {
  @apply text-lg font-medium;
}
.item-subtitle {
  @apply text-xs font-normal;
}
</style>
