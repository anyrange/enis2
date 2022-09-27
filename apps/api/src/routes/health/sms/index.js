import fetch from "node-fetch"

const SECOND = 1000

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
      const controller = new AbortController()

      const timeoutId = setTimeout(() => controller.abort(), 15 * SECOND)

      try {
        const res = await fetch(`https://sms.${req.query.city}.nis.edu.kz/`, {
          redirect: "manual",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        return reply.send({ alive: res.status < 400 })
      } catch {
        return reply.send({ alive: false })
      }
    }
  )
}
