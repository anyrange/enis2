<template>
  <div
    class="
      rounded
      p-2
      dark:bg-gray-800-spotify
      bg-white
      shadow-md
      flex flex-col
      space-y-2
    "
  >
    <div
      v-if="!!subject.length"
      class="
        flex
        space-x-1
        items-baseline
        text-gray-450-spotify
        dark:text-gray-500-spotify
        justify-between
      "
    >
      <h4 class="font-medium">
        {{ label }}
      </h4>
      <span class="font-normal text-xs">
        {{ scores }}/{{ maxScores }} - {{ percent }}
      </span>
    </div>
    <div
      v-for="item in subject"
      :key="item"
      class="flex flex-row justify-between space-x-1"
    >
      <span>{{ item.Name }}</span>
      <span>
        {{ item.Score === -1 ? "-" : item.Score }}/{{
          item.MaxScore === 0 ? "-" : item.MaxScore
        }}
      </span>
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
  computed: {
    filteredSubject() {
      return this.subject.filter((s) => s.Score !== -1);
    },
    scores() {
      return this.filteredSubject.reduce((n, { Score }) => n + Score, 0);
    },
    maxScores() {
      return this.filteredSubject.reduce((n, { MaxScore }) => n + MaxScore, 0);
    },
    percent() {
      const percent = Math.ceil((this.scores / this.maxScores) * 100) || 0;
      return `${percent}%`;
    },
  },
};
</script>
