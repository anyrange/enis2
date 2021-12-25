import fp from "fastify-plugin";

const isDev = process.env.NODE_ENV !== "production";

const serverDomain = process.env.VITE_SERVER_URL;

const plugin = fp(async function plugin(fastify) {
  const year = 60 * 60 * 24 * 365;
  fastify.decorate("cookieOptions", {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    maxAge: year,
    secure: true,
    ...(!isDev && {
      domain: serverDomain,
    }),
  });
});
export default plugin;
