<template>
  <div class="subject-container">
    <h4 class="subject-part-title">
      {{ label }}
    </h4>
    <div
      v-for="item in subject"
      :key="item"
      class="subject-section-list"
    >
      <span class="subject-section-title">
        {{ item.Name }}
      </span>
      <div v-if="item.Score !== -1">
        <span>{{ item.Score }}</span>
        <span>/{{ item.MaxScore }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubjectSections",
  props: {
    subject: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="postcss" scoped>
.subject-container {
  @apply rounded p-2 dark:bg-gray-800-spotify bg-white shadow-md flex flex-col;
}
.subject-part-title {
  @apply mb-2 font-semibold text-gray-450-spotify dark:text-gray-500-spotify;
}
.subject-section-list {
  @apply flex flex-row justify-between;
}
.subject-section-title {
  @apply font-normal text-base;
}
</style>