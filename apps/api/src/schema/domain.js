import fp from "fastify-plugin"

export default fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "domain",
    title: "City in query",
    type: "object",
    properties: {
      city: fastify.getSchema("city"),
    },
  })
})
