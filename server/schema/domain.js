import fp from "fastify-plugin";

export default fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "domain",
    title: "Require city in query",
    type: "object",
    required: ["city"],
    properties: {
      city: fastify.getSchema("city"),
      token: { type: "string" },
    },
  });
});
