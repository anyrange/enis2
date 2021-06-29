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
});

export default createStore({
  modules,
  plugins: [createPersistedState()],
});
