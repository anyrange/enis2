/* eslint-disable no-useless-escape */
import fp from "fastify-plugin";

const imported = {
  schemas: import.meta.globEager("./schema/**/*.(ts|js|cjs|mjs)"),
  plugins: import.meta.globEager("./plugins/**/*.(ts|js|cjs|mjs)"),
  routes: import.meta.globEager("./routes/**/*.(ts|js|cjs|mjs)"),
};

const load = (items, type, options, app) => {
  if (!items) return console.error(`\n [Autoload] Unknown type: ${type} \n`);

  Object.entries(items).forEach(([path, exports]) => {
    const { default: itemModule } = exports;

    if (itemModule === undefined)
      return console.error(
        `\n [Autoload] Please export plugin from module ${path}. \n`
      );

    if (typeof itemModule !== "function")
      return console.error(
        `\n [Autoload] Plugin exported from ${path} is not a function. \n`
      );

    if (type === "routes") {
      const routePath = path
        .replace("./routes", "")
        .replace(/[\\\/][^\\\/]*\..*/, "")
        .replace(/[\\\/]_/g, "/:");

      void app.register(itemModule, { prefix: routePath });
      return;
    }

    void app.register(itemModule);
  });
};

const autoload = async (app, opts) => {
  Object.entries(imported).forEach(([type, items]) => {
    if (items) load(items, type, opts, app);
  });
};

export default fp(autoload, "3.x");
