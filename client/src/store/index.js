import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const requireModule = require.context("./modules", false, /\.js$/);
const modules = {};
requireModule.keys().forEach((fileName) => {
  if (fileName === "./index.js") return;
  const moduleName = fileName.replace(/(\.\/|\.js)/g, "");
  modules[moduleName] = {
    ...requireModule(fileName).default,
  };
  modules[moduleName].namespaced = true;
});

export default createStore({
  modules,
  plugins: [
    createPersistedState({
      paths: ["auth", "preferences", "years", "terms", "diary", "grades"],
    }),
  ],
});