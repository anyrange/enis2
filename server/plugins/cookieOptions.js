import fp from "fastify-plugin";

const isDev = process.env.NODE_ENV !== "production";

const plugin = fp(async function plugin(fastify) {
  const year = 60 * 60 * 24 * 365;
  fastify.decorate("cookieOptions", {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    maxAge: year,
    secure: true,
    ...(!isDev && { domain: "enis2.ml" }),
  });
});
export default plugin;
