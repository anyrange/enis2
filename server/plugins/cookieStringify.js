import fp from "fastify-plugin";
const plugin = fp(async function plugin(fastify) {
  fastify.decorate("cookieStringify", (cookiesRaw) => {
    return Object.entries(cookiesRaw)
      .map((cookie) => cookie.join("="))
      .join("; ");
  });
});
export default plugin;
