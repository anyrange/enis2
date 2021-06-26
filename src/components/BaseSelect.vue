<template>
  <div class="flex flex-col gap-2">
    <label
      for="base-select"
      class="text-base font-medium select-none text-gray-600-spotify dark:text-gray-500-spotify"
    >
      {{ label }}
    </label>
    <select
      :value="modelValue.value"
      id="base-select"
      name="base-select"
      autocomplete="on"
      @input="$emit('input', $event.target.value)"
      class="w-full text-sm py-2 px-2 select-none rounded-sm focus:outline-none focus:ring-2 bg-gray-100 dark:bg-gray-700-spotify text-gray-600-spotify dark:text-gray-500-spotify"
    >
      <option v-for="option in options" :key="option" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "BaseSelect",
  props: {
    modelValue: {
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
    options: {
      type: Array,
      required: true,
    },
  },
};
</script>
