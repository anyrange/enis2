import fp from "fastify-plugin";
const plugin = fp(async function plugin(fastify) {
  fastify.decorate("cookieParse", (res) => {
    const rawCookies = res.headers.raw()["set-cookie"];

    if (!rawCookies) return null;

    return rawCookies
      .map((entry) => {
        const parts = entry.split(";");
        const [name, value] = parts[0].split("=");

        return { name, value };
      })
      .filter((cookie) => cookie.name !== "lang");
  });
});
export default plugin;
