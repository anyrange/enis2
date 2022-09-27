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
        const res = await fetch(`https://sms.${req.query.city}.nis.edu.kz/`)
        if (!res.ok) throw new Error()

        await reply.send({ alive: true })
      } catch {
        await reply.send({ alive: false })
      }
    }
  )
}
