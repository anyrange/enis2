import fp from "fastify-plugin";

const isDev = process.env.NODE_ENV !== "production";

const url = new URL(process.env.FRONTEND_URL);
const splittedUrl = url.hostname.split(".");
const productionUrl = `${splittedUrl[splittedUrl.length - 2]}.${
  splittedUrl[splittedUrl.length - 1]
}`;

const domain = isDev ? url.hostname : productionUrl;

const plugin = fp(async function plugin(fastify) {
  const year = 60 * 60 * 24 * 365;
  fastify.decorate("cookieOptions", {
    path: "/",
    sameSite: "none",
    httpOnly: true,
    secure: true,
    domain: domain,
    maxAge: year,
  });
});
export default plugin;
