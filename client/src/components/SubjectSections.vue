<template>
  <div
    class="
      rounded
      p-2
      dark:bg-gray-800-spotify
      bg-white
      shadow-md
      flex flex-col
      gap-2
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
      <span class="font-normal text-base">
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
