import fp from "fastify-plugin"

export default fp(async function plugin(fastify) {
  fastify.setNotFoundHandler((req, reply) => {
    reply.code(404).send({ message: "Service not found" })
  })
})
