import fetch from "node-fetch";

export default async function(fastify) {
  const querystring = fastify.getSchema("domain");
  fastify.get(
    "",
    { schema: { querystring, response: { 200: { type: "string" } } } },
    async (req, reply) => {
      const cookie = fastify.cookieStringify(req.cookies);

      const response = await fetch(
        `https://${req.query.city}/root/Account/RefreshCaptcha`,
        {
          headers: { cookie },
        }
      ).then((res) => res.json());

      if (!response.data || !response.data.base64img)
        return reply
          .code(400)
          .send({ message: "Что-то пошло не так", statusCode: 400 });

      reply.code(200).send(response.data.base64img);
    }
  );
}
