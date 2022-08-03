<template>
  <div
    tabindex="0"
    class="rounded shadow bg-white dark:bg-secondary-darker appearance-none"
    :class="[
      [
        hoverable
          ? 'default-focus cursor-pointer subject-diary-hoverable'
          : 'outline-none cursor-default select-text',
      ],
      { 'opacity-50 pointer-events-none	': !subject.Evaluations.length },
    ]"
    @click="emit('click')"
    @keyup.enter="emit('click')"
  >
    <div class="space-y-2 p-2">
      <span class="flex text-base font-medium truncate">
        {{ subject.Name }}
      </span>
      <div class="flex justify-between">
        <div>
          <span class="item-title">
            {{ percentDecimals.before }}
          </span>
          <span class="item-subtitle">
            {{ percentDecimals.after && "." + percentDecimals.after }}%
          </span>
        </div>
        <div>
          <span class="item-subtitle">оценка </span>
          <span class="item-title">
            {{ subject.Mark }}
          </span>
        </div>
      </div>
    </div>
    <div :class="mark.bgClass" class="rounded-b-md bg-opacity-20">
      <div
        class="h-1 rounded-bl-md"
        style="transition: width 0.3s ease-in-out, color 0.1s ease"
        :style="{ width: props.subject.Score + '%' }"
        :class="mark.bgClass"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { getPercentDecimals, between } from "../../../utils";
import useSettingsStore from "../../../stores/settings";

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

const percentDecimals = computed(() => getPercentDecimals(props.subject.Score));

const settingsStore = useSettingsStore();
const markRanges = computed(() => {
  return {
    5: {
      range: [settingsStore.ranges[3], settingsStore.ranges[4]],
      bgClass: "bg-q-positive",
    },
    4: {
      range: [settingsStore.ranges[2], settingsStore.ranges[3] - 1],
      bgClass: "bg-q-warning",
    },
    3: {
      range: [settingsStore.ranges[1], settingsStore.ranges[2] - 1],
      bgClass: "bg-q-negative",
    },
    2: {
      range: [settingsStore.ranges[0], settingsStore.ranges[1] - 1],
      bgClass: "bg-black/30",
    },
  };
});

const mark = computed(() => {
  const roundedPercent = Math.round(props.subject.Score);
  const [name, { bgClass }] = Object.entries(markRanges.value).find(
    ([, { range }]) => between(roundedPercent, ...range)
  );
  return { name, bgClass };
});
</script>

<style scoped>
@media (hover: hover) {
  .subject-diary-hoverable:hover {
    @apply hover:bg-white/40 dark:hover:bg-secondary-dark/60;
  }
}
.item-title {
  @apply text-lg font-medium;
}
.item-subtitle {
  @apply text-xs font-normal;
}
</style>
