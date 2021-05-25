import fetch from "node-fetch";

export default async function(fastify) {
  const querystring = fastify.getSchema("domain");
  fastify.get(
    "/",
    { schema: { querystring }, attachValidation: true },
    async (req, reply) => {
      try {
        if (req.validationError)
          return reply.code(404).send({ message: "Invalid data" });

        const cookie = Object.entries(req.cookies)
          .map((cookie) => cookie.join("="))
          .join("; ");

        const response = await fetch(
          `https://${req.query.city}/root/Account/RefreshCaptcha`,
          {
            headers: { cookie },
          }
        );

        const body = await response.json();

        if (!body.data.base64img)
          return reply.code(400).send({ message: "Что-то пошло не так" });

        reply.code(200).send({ base54img: body.data.base64img });
      } catch (err) {
        console.log(err);
        reply.code(500).send({ message: "Что-то пошло не так" });
      }
    }
  );
}
