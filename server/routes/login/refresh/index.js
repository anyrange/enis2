export default async function(fastify) {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["login", "password", "captchaInput"],
          properties: {
            login: { type: "string", minLength: 12, maxLength: 12 },
            password: { type: "string", minLength: 1 },
            captchaInput: { type: "string" },
          },
        },
      },
      attachValidation: true,
    },
    async (req, reply) => {
      if (req.validationError)
        return reply.code(404).send({ message: "Invalid data" });

      reply.code(200).send("");
    }
  );
}
