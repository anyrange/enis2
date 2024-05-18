<template>
  <div class="item">
    <div class="item-top">
      <span class="item-top-subject">
        {{ subject.subject.name.ru }}
      </span>
      <div v-if="subject.Exam !== 'none'" class="item-top-box">
        <span class="item-top-box-mark">{{
          formatScore(subject.resultMark)
        }}</span>
        <span class="item-top-box-label">Экзамен</span>
      </div>
      <div class="item-top-box">
        <span class="item-top-box-mark">{{ formatScore(subject.Final) }}</span>
        <span class="item-top-box-label">Итоговая</span>
      </div>
    </div>
    <div class="item-bottom">
      <template v-if="!subject.firstHalfYearMark">
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">I</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.firstPeriod) }}
          </span>
        </div>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">II</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.secondPeriod) }}
          </span>
        </div>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">III</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.thirdPeriod) }}
          </span>
        </div>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">IV</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.fourthPeriod) }}
          </span>
        </div>
      </template>
      <template v-else>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">I и II</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.firstHalfYearMark) }}
          </span>
        </div>
        <div class="item-bottom-box">
          <span class="item-bottom-box-label">III и IV</span>
          <span class="item-bottom-box-mark">
            {{ formatScore(subject.secondHalfYearMark) }}
          </span>
        </div>
      </template>
      <div class="item-bottom-box">
        <span class="item-bottom-box-label">Годовая</span>
        <span class="item-bottom-box-mark">
          {{ formatScore(subject.yearMark) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subject: {
    type: Object,
    required: true,
  },
})

const formatScore = (score) => {
  const scoreValue = score && score.ru
  switch (scoreValue) {
    case "зачет":
      return "Зачёт"
    case "незачет":
      return "Незачёт"
    case null:
    case undefined:
      return "-"
    default:
      return Number(scoreValue)
  }
}
</script>

<style scoped>
.item {
  @apply flex flex-col space-y-6 w-full justify-center rounded shadow-sm bg-white dark:bg-secondary-darker;
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
  @apply flex w-full justify-between p-3 border-t border-gray-200 dark:border-secondary;
}
.item-bottom-box {
  @apply flex flex-col items-center justify-center;
}
.item-bottom-box-label {
  @apply text-sm font-normal text-gray-400 dark:text-secondary-lighter;
}
.item-bottom-box-mark {
  @apply text-lg font-medium;
}
</style>
