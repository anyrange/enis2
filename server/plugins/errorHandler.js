import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.setNotFoundHandler((req, reply) => {
    reply.code(404).send({ message: "Service not found", statusCode: 404 });
  });

  fastify.setErrorHandler((err, req, reply) => {
    const { validation, code, message } = err;

    if (validation) {
      const { statusCode, message } = validate(err);
      return reply.code(statusCode).send({ message, statusCode });
    }

    if (code === "ETIMEDOUT")
      return reply
        .code(503)
        .send({ message: "Попробуйте снова", statusCode: code });

    if (code) return reply.code(code).send({ message, statusCode: code });

    reply
      .code(500)
      .send({ message: "Сервис временно недоступен", statusCode: 500 });

    console.log(err);
  });
});

const validate = (validationError) => {
  const context = validationError.validationContext;

  switch (context) {
    case "headers":
      return { statusCode: 401, message: "Unauthorized" };

    case "querystring": {
      const error = validationError.validation[0];
      return {
        statusCode: 400,
        message: `Invalid query parameters:${error.dataPath.substring(1)} ${
          error.message
        }`,
      };
    }

    case "params":
      return { statusCode: 400, message: "Invalid id" };

    case "body":
      return {
        statusCode: 400,
        message: `Invalid body: ${validationError.validation[0].message}`,
      };

    default:
      return { statusCode: 400, message: "Bad request" };
  }
};
export default plugin;
