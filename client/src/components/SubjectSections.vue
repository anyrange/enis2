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
    <h4 class="font-semibold text-gray-450-spotify dark:text-gray-500-spotify">
      {{ label }}
    </h4>
    <div
      v-for="item in subject"
      :key="item"
      class="flex flex-row justify-between"
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
};
</script>
