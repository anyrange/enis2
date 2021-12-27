import { computed } from "vue";

export default () => {
  const isMobile = computed(() =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
  const isSafari = computed(() =>
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  );
  return {
    isMobile,
    isSafari,
  };
};
