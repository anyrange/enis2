<template>
  <div class="item" :class="itemClass">
    <div class="item-container">
      <h3 class="item-subject">
        {{ subject.Name }}
      </h3>
      <div class="item-bottom">
        <div>
          <span class="item-title">
            {{ beforeDecimal }}
          </span>
          <span v-show="afterDecimal" class="item-subtitle"
            >.{{ afterDecimal }}</span
          >
          <span class="item-subtitle">%</span>
        </div>
        <div>
          <span class="item-subtitle">оценка </span>
          <span class="item-title">{{ subject.Mark }}</span>
        </div>
      </div>
    </div>
    <div :class="barClass" class="item-progress-container">
      <div class="item-progress-bar" :style="barStyle" :class="barClass">
        &nbsp;
      </div>
    </div>
  </div>
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
    valueRounded() {
      return Math.ceil(this.subject.Score);
    },
    itemClass() {
      return this.hoverable ? "item-hoverable" : "";
    },
    barClass() {
      const roundedScore = this.valueRounded;
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
.item {
  @apply flex flex-col rounded shadow bg-white dark:bg-gray-800-spotify;
}
.item-hoverable {
  @apply cursor-pointer hover:bg-gray-400 hover:bg-opacity-10 dark:hover:bg-gray-700-spotify;
}
.item-container {
  @apply flex flex-col gap-2 p-2;
}
.item-subject {
  @apply text-base font-medium truncate;
}
.item-bottom {
  @apply flex justify-between;
}
.item-title {
  @apply text-lg font-medium;
}
.item-subtitle {
  @apply text-xs font-normal;
}
.item-progress-container {
  @apply rounded-b-md dark:bg-opacity-10 bg-opacity-20;
}
.item-progress-bar {
  @apply h-1 rounded-bl-md;
}
</style>
