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
    <div class="space-y-2 p-2">
      <h3 class="flex text-base font-medium truncate">
        {{ subject.Name }}
      </h3>
      <div class="flex justify-between">
        <div>
          <span class="item-title">
            {{ beforeDecimal }}
          </span>
          <span v-show="afterDecimal" class="item-subtitle"
            >.{{ afterDecimal }}
          </span>
          <span class="item-subtitle">%</span>
        </div>
        <div>
          <span class="item-subtitle">оценка </span>
          <span class="item-title">{{ subject.Mark }}</span>
        </div>
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
    beforeDecimal() {
      return (this.subject.Score + "").split(".")[0];
    },
    afterDecimal() {
      return (this.subject.Score + "").split(".")[1];
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
