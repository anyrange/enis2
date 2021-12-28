import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorateRequest("cookies", "");
  fastify.decorateRequest("account", "");

  fastify.addHook("preValidation", async (req, reply) => {
    if (!req.query.token) return;
    try {
      fastify.jwt.verify(req.query.token, (err, decoded) => {
        if (err) throw err;
        req.cookies = decoded.cookies;
        req.account = decoded.account;
      });
    } catch (e) {
      return;
    }
  });
});

export default plugin;
