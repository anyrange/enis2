import fetch from "node-fetch"

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        tags: ["system"],
      },
    },
    async (req, reply) => {
      try {
        const res = await fetch(`https://sms.${req.query.city}.nis.edu.kz/`, {
          redirect: "manual",
        })
        await reply.send({ alive: res.status < 400 })
      } catch {
        await reply.send({ alive: false })
      }
    }
  )
}
