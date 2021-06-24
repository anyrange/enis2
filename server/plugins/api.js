import fp from "fastify-plugin";
import fetch from "node-fetch";

export default fp(async function plugin(fastify) {
  fastify.decorate(
    "api",
    async ({ cookie = "", body = {}, url, method = "GET" }) => {
      let options = { method, headers: { cookie } };

      if (method === "POST") options = Object.assign(options, { body });

      const response = await fetch(url, options);

      if (!response.ok) {
        const err = new Error(response.statusText);
        err.code = response.status;
        throw err;
      }

      const json = await response.json();

      if (!json.success) {
        const err = new Error(json.message);
        err.code = 400;
        throw err;
      }

      return json;
    }
  );
});
