<template>
  <vue-scroll-picker v-model="model" :options="options" />
</template>

<script setup>
import { computed } from "vue";
import { VueScrollPicker } from "vue-scroll-picker";

const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});
</script>

<style>
.vue-scroll-picker {
  position: relative;
  width: 100%;
  height: 1.5em;
  overflow: hidden;
}

.vue-scroll-picker-rotator {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% - 0.6em);
}

.vue-scroll-picker-rotator-transition {
  transition: top ease 200ms;
}

.vue-scroll-picker-item {
  text-align: center;
  line-height: 1em;
  color: var(--scroll-picker-item-color);
}

.vue-scroll-picker-item-selected {
  color: #007bff;
}

.vue-scroll-picker-layer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.vue-scroll-picker-layer-top,
.vue-scroll-picker-layer-selection,
.vue-scroll-picker-layer-bottom {
  position: absolute;
  left: 0;
  right: 0;
}

.vue-scroll-picker-layer-top {
  box-sizing: border-box;
  top: 0;
  height: calc(50% - 1em);
  cursor: pointer;
  border-top: 3px solid var(--scroll-picker-border-color);
  z-index: 10;
}

.vue-scroll-picker-layer-selection {
  top: calc(50% - 1em);
  bottom: calc(50% - 1em);
}

.vue-scroll-picker-layer-bottom {
  bottom: 0;
  height: calc(50% - 1em);
  cursor: pointer;
  border-top: 3px solid var(--scroll-picker-border-color);
}
</style>
