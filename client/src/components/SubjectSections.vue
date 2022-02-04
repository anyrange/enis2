<template>
  <div
    class="rounded p-2 dark:bg-gray-800-spotify bg-white shadow-md flex flex-col space-y-2"
  >
    <div
      v-if="!!subject.length"
      class="flex space-x-1 items-baseline text-gray-450-spotify dark:text-gray-500-spotify justify-between"
    >
      <h4 class="font-medium">
        {{ label }}
      </h4>
      <span class="font-normal text-xs">
        {{ scores }}/{{ maxScores }} - {{ percent }}%
      </span>
    </div>
    <div
      v-for="item in subject"
      :key="item"
      class="flex flex-row justify-between items-start space-x-2"
    >
      <span class="w-4/5 justify-start">{{ item.Name }}</span>
      <div class="w-auto justify-end">
        <div class="w-full flex items-start justify-evenly text-center">
          <div class="w-4.5">
            <template v-if="subjectStore.GM">
              <scroll-picker
                v-model="item.Score"
                :options="
                  new Array(item.MaxScore + 1)
                    .fill()
                    .map((e, i) => ({ name: i, value: i }))
                "
              />
            </template>
            <template v-else>
              {{ item.Score === -1 ? "-" : item.Score }}
            </template>
          </div>
          <div class="w-2">/</div>
          <div class="w-4.5">
            {{ item.MaxScore === 0 ? "-" : item.MaxScore }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { VueScrollPicker as ScrollPicker } from "vue-scroll-picker";
import {
  getFilteredSection,
  getScores,
  getMaxScores,
  getPercent,
} from "@/utils";
import { useSubject } from "@/store";
import { computed } from "vue";

const props = defineProps({
  subject: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const subjectStore = useSubject();

const filteredSections = computed(() => getFilteredSection(props.subject));
const scores = computed(() => getScores(filteredSections.value));
const maxScores = computed(() => getMaxScores(filteredSections.value));
const percent = computed(() => {
  const p = (scores.value / maxScores.value) * 100 || 0;
  return p ? getPercent(p) : 0;
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
