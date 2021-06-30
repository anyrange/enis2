import fp from "fastify-plugin";
const plugin = fp(async function plugin(fastify) {
  const url = new URL(process.env.FRONTEND_URI);
  const year = 60 * 60 * 24 * 365;
  fastify.decorate("cookieOptions", {
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: true,
    domain: url.hostname,
    maxAge: year,
  });
});
export default plugin;
