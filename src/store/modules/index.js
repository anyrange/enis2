const requireModule = require.context(".", false, /\.js$/);
const modules = {};
requireModule.keys().forEach((fileName) => {
  if (fileName === "./index.js") return;
  const moduleName = fileName.replace(/(\.\/|\.js)/g, "");
  modules[moduleName] = {
    namespaced: true,
    ...requireModule(fileName).default,
  };
});
export default modules;
