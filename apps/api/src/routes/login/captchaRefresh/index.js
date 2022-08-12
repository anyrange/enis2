import fetch from "node-fetch"

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        headers: fastify.getSchema("token"),
        response: { 200: { type: "string" } },
        tags: ["login"],
      },
    },
    async (req, reply) => {
      const cookie = req.cookies

      const response = await fetch(
        `https://sms.${req.query.city}.nis.edu.kz/root/Account/RefreshCaptcha`,
        { headers: { cookie } }
      ).then((res) => res.json())

      if (!response.data || !response.data.base64img)
        return reply
          .code(400)
          .send({ message: response.message || "Что-то пошло не так" })

      reply.code(200).send(response.data.base64img)
    }
  )
}
