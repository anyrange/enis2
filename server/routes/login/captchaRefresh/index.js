export default async function(fastify) {
  const querystring = fastify.getSchema("domain");
  fastify.get("", { schema: { querystring } }, async (req, reply) => {
    const cookie = Object.entries(req.cookies)
      .map((cookie) => cookie.join("="))
      .join("; ");

    const response = await fastify.api({
      url: `https://${req.query.city}/root/Account/RefreshCaptcha`,
      cookie,
    });

    if (!response.data.base64img)
      return reply.code(400).send({ message: "Что-то пошло не так" });

    reply.code(200).send(response.data.base64img);
  });
}
