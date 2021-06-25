<template>
  <div class="flex flex-col gap-2">
    <label
      for="label"
      class="block text-base text-gray-600-spotify dark:text-gray-500-spotify"
    >
      {{ label }}
    </label>
    <select
      :id="label"
      :value="modelValue.value"
      name="label"
      autocomplete="on"
      @input="$emit('input', $event.target.value)"
      class="block w-full py-2 px-2 bg-gray-100 text-gray-600-spotify dark:bg-gray-700-spotify dark:text-gray-500-spotify rounded-md focus:outline-none focus:ring-2"
    >
      <option v-for="option in options" :key="option" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
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
