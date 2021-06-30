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

      if (
        response.headers.raw()["content-type"][0] !== "text/json; charset=utf-8"
      )
        return;

      const json = await response.json();
      return json;
    }
  );
});
