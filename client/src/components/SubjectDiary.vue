<template>
  <button
    id="subjectDiary"
    class="
      rounded
      shadow
      bg-white
      dark:bg-gray-800-spotify
      appearence-none
      focus:outline-none
      outline-none
    "
    :class="[
      hoverable
        ? 'cursor-pointer hover:bg-gray-200 hover:bg-opacity-10 dark:hover:bg-gray-700-spotify'
        : 'cursor-default select-text',
    ]"
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
      <div class="h-1 rounded-bl-md" :style="barStyle" :class="barClass" />
    </div>
  </button>
</template>

<script>
export default {
  name: "SubjectDiary",
  props: {
    subject: {
      type: Object,
      required: true,
    },
    hoverable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    scoreDecimals() {
      const scoreParts = `${this.subject.Score}`.split(".");
      return {
        before: scoreParts[0],
        after: scoreParts[1],
      };
    },
    barClass() {
      const roundedScore = Math.ceil(this.subject.Score);
      if (roundedScore >= 85) return "bg-q-positive";
      if (roundedScore >= 65) return "bg-q-warning";
      return "bg-q-negative";
    },
    barStyle() {
      return {
        width: this.subject.Score + "%",
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
#subjectDiary:focus-visible {
  @apply focus:ring-2;
}
.item-title {
  @apply text-lg font-medium;
}
.item-subtitle {
  @apply text-xs font-normal;
}
</style>
