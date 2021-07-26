"use strict";

import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.setErrorHandler((err, req, reply) => {
    const { validation, code, message } = err;

    if (validation) {
      const message = validate(err);
      return reply.code(400).send({ message });
    }

    if (code === "ETIMEDOUT")
      return reply.code(503).send({ message: "Попробуйте снова" });

    if (code && typeof code === "number" && code > 200 && code < 600)
      return reply.code(code).send({ message });

    reply.code(500).send({ message: "Сервис временно недоступен" });
    console.log(err);
  });
});

const validate = ({ validationContext, validation }) => {
  const result = validation[0];

  switch (validationContext) {
    case "querystring":
      return `Invalid query parameters:${result.dataPath.substring(1)} ${
        result.message
      }`;
    case "params":
      return `Invalid ${result.dataPath.substring(1)}`;
    case "body":
      return `Invalid body: ${result.message}`;
    default:
      return "Bad request";
  }
};

export default plugin;
