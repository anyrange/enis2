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
import { isDev } from "../settings";

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
  },
  plugins: [
    createPersistedState({
      key: isDev ? "development" : "production",
      storage: isDev
        ? null
        : {
            getItem: (key) => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: (key) => ls.remove(key),
          },
      paths: ["auth", "preferences", "years", "terms"],
    }),
  ],
});
