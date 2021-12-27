import { isDev, isLocal } from "../config";
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
import auth from "./modules/auth.js";
import diary from "./modules/diary.js";
import grades from "./modules/grades.js";
import preferences from "./modules/preferences.js";
import subject from "./modules/subject.js";
import terms from "./modules/terms.js";
import years from "./modules/years.js";
import loader from "./modules/loader.js";
import health from "./modules/health.js";

const ls = new SecureLS({ isCompression: false });

export default createStore({
  modules: {
    auth,
    diary,
    grades,
    preferences,
    subject,
    terms,
    years,
    loader,
    health,
  },
  plugins: [
    createPersistedState({
      key: isDev ? "development-1.7" : "production-1.6",
      storage: isLocal
        ? null
        : {
            getItem: (key) => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: (key) => ls.remove(key),
          },
      paths: ["auth", "preferences", "years", "terms", "diary", "grades"],
    }),
  ],
});
