export default async function(fastify) {
  fastify.addHook("onSend", async (request, reply) => {
    if (reply.statusCode === 200)
      reply.header("Cache-Control", "public, max-age=60");
  });
}
