import { watch, ref } from "vue";

export default () => {
  const toggleClass = (watcher, className) => {
    const watcherRef = ref(watcher);
    watch(
      () => watcherRef.value,
      (value) => {
        value
          ? document.documentElement.classList.add(className)
          : document.documentElement.classList.remove(className);
      },
      {
        immediate: true,
      }
    );
  };
  return {
    toggleClass,
  };
};
