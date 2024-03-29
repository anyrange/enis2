import fp from "fastify-plugin"

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("cookieParse", (res) => {
    const rawCookies = res.headers.raw()["set-cookie"]

    if (!rawCookies) return null

    return rawCookies.map((cookie) => cookie.split(";")[0]).join("; ")
  })
})

export default plugin
