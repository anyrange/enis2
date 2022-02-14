import fp from "fastify-plugin";

const plugin = fp(async function plugin(fastify) {
  fastify.decorateRequest("cookies", "");
  fastify.decorateRequest("account", "");

  fastify.addHook("preValidation", async (req) => {
    if (!req.headers.authorization) return;
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      fastify.jwt.verify(token, (err, decoded) => {
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
