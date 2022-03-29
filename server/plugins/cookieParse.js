import fp from "fastify-plugin";

export const cookieParse = (res) => {
  const rawCookies = res.headers.raw()["set-cookie"];

  if (!rawCookies) return null;

  return rawCookies
    .map((cookie) => cookie.split(";")[0])
    .filter((cookie) => cookie.split("=")[0] !== "lang")
    .join("; ");
};

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("cookieParse", cookieParse);
});

export default plugin;
