export default async function(fastify) {
  fastify.addHook("onSend", (request, reply, payload, next) => {
    if (reply.statusCode === 200)
      reply.header("Cache-Control", "public, max-age=60");
    next();
  });
}
