import { createPinia } from "pinia";
import { watch } from "vue";
import useAuth from "./modules/auth.js";
import useDiary from "./modules/diary.js";
import useGrades from "./modules/grades.js";
import useSettings from "./modules/settings.js";
import useSubject from "./modules/subject.js";
import useTerms from "./modules/terms.js";
import useYears from "./modules/years.js";
import useLoader from "./modules/loader.js";
import useHealth from "./modules/health.js";

const createPersistedState =
  (options) =>
  ({ store }) => {
    const storage = options.storage || (window && window.localStorage);
    const modules = options.modules;

    const key = store.$id;
    const isPersited = modules.includes(key);

    function getState(key, storage) {
      const value = storage.getItem(key);
      try {
        return typeof value === "string"
          ? JSON.parse(value)
          : typeof value === "object"
          ? value
          : undefined;
      } catch (err) {
        console.error(err);
      }
      return undefined;
    }
    function setState(key, state, storage) {
      return storage.setItem(key, JSON.stringify(state));
    }

    const localState = getState(key, storage);

    if (localState) {
      store.$patch(localState);
      setState(key, store.$state, storage);
    }

    watch(
      store.$state,
      () => {
        isPersited && setState(key, store.$state, storage);
      },
      { immediate: true }
    );
  };

const pinia = createPinia();

pinia.use(
  createPersistedState({
    modules: ["auth", "settings", "years", "terms", "diary", "grades"],
  })
);

export {
  useAuth,
  useDiary,
  useGrades,
  useSettings,
  useSubject,
  useTerms,
  useYears,
  useLoader,
  useHealth,
};

export default pinia;
