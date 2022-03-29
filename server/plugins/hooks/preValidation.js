import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET || "secret";

const plugin = fp(async function plugin(fastify) {
  fastify.decorateRequest("cookies", "");
  fastify.decorateRequest("account", "");

  fastify.addHook("preValidation", async (req) => {
    if (!req.headers.authorization) return;
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      jwt.verify(token, SECRET, (err, decoded) => {
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
