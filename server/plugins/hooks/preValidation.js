import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorateRequest("cookies", "");

  fastify.addHook("preValidation", async (req) => {
    try {
      if (!req.query.token) return;
      const token = fastify.jwt.verify(req.query.token);
      req.cookies = token.cookies;
    } catch (e) {
      return;
    }
  });
});

export default plugin;
