<template>
  <div class="item">
    <div class="item-top">
      <span class="item-top-subject">
        {{ subject.SubjectName }}
      </span>
      <div v-if="subject.Exam !== 'none'" class="item-top-box">
        <span class="item-top-box-mark">{{ subject.Exam }}</span>
        <span class="item-top-box-label">Экзамен</span>
      </div>
      <div v-if="subject.Final !== 'none'" class="item-top-box">
        <span class="item-top-box-mark">{{ subject.Final }}</span>
        <span class="item-top-box-label">Итоговая</span>
      </div>
    </div>
    <div class="item-bottom">
      <template v-if="subject.FirstHalfYear === 'none'">
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">I</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.FirstPeriod) }}
          </span>
        </div>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">II</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.SecondPeriod) }}
          </span>
        </div>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">III</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.ThirdPeriod) }}
          </span>
        </div>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">IV</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.ForthPeriod) }}
          </span>
        </div>
      </template>
      <template v-else>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">I и II</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.FirstHalfYear) }}
          </span>
        </div>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">III и IV</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.SecondHalfYear) }}
          </span>
        </div>
      </template>
      <div class="item-bottom-box">
        <span class="item-bottom-box-label">Годовая</span>
        <span class="item-bottom-box-mark">
          {{ formatScore(subject.Year) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubjectGrades",
  props: {
    subject: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatScore(score) {
      if (score === "true") return "Зачёт";
      if (score === "false") return "Незачёт";
      return score;
    },
  },
};
</script>

<style lang="postcss" scoped>
.item {
  @apply flex flex-col gap-6 w-full justify-center rounded shadow-sm bg-white dark:bg-gray-800-spotify;
}
.item-top {
  @apply flex items-start justify-between p-3;
}
.item-top-subject {
  @apply text-2xl font-medium truncate;
}
.item-top-box {
  @apply flex flex-col items-center;
}
.item-top-box-mark {
  @apply text-2xl font-medium;
}
.item-top-box-label {
  @apply text-sm;
}
.item-bottom {
  @apply flex w-full justify-between p-3 border-t border-gray-200 dark:border-gray-600-spotify;
}
.item-bottom-box {
  @apply flex flex-col items-center justify-center;
}
.item-bottom-box-label {
  @apply text-sm font-normal text-gray-400 dark:text-gray-500-spotify;
}
.item-bottom-box-mark {
  @apply text-lg font-medium;
}
</style>
