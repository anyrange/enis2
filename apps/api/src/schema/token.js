import fp from "fastify-plugin"

export default fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "token",
    title: "Require token in header",
    type: "object",
    required: ["authorization"],
    properties: { authorization: { type: "string" } },
  })
})
