import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import auth from "./modules/auth.js";
import diary from "./modules/diary.js";
import grades from "./modules/grades.js";
import preferences from "./modules/preferences.js";
import subject from "./modules/subject.js";
import terms from "./modules/terms.js";
import years from "./modules/years.js";

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
      paths: ["auth", "preferences", "years", "terms", "diary", "grades"],
    }),
  ],
});
