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
      ) {
        const message = await response.text();
        const err = new Error(message);
        err.code =
          message ===
          "Сессия пользователя была завершена, перезагрузите страницу"
            ? 401
            : 500;
        throw err;
      }

      const json = await response.json();
      if (!json.success) {
        const err = new Error(json.message);
        err.code = 500;
        throw err;
      }

      return json;
    }
  );
});
