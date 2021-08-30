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

      const isJSON =
        response.headers.raw()["content-type"][0] ===
        "text/json; charset=utf-8";

      if (!isJSON) {
        const message = await response.text();

        const isExpired =
          message ===
          "Сессия пользователя была завершена, перезагрузите страницу";

        if (isExpired) {
          const err = new Error("Сессия пользователя была завершена");
          err.code = 401;
          throw err;
        }

        const err = new Error(message);
        err.code = 400;
        throw err;
      }

      const json = await response.json();

      if (!json.success) {
        const isExpired =
          json.message ===
          "Время работы с дневником завершено. Для продолжения необходимо обновить модуль";

        if (isExpired) {
          const err = new Error("Время работы с дневником завершено");
          err.code = 401;
          throw err;
        }

        const err = new Error(json.details || json.message);
        err.code = 400;
        throw err;
      }

      json.statusCode = response.status;
      json.cookies = fastify.cookieParse(response);
      return json;
    }
  );
});
