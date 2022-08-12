import fp from "fastify-plugin"

const stringToObject = (cookieString) => {
  const arrayOfCookies = cookieString
    .split("; ")
    .filter((c) => !!c.length) // filter empty values
    .map((c) => c.split("="))

  return Object.fromEntries(arrayOfCookies)
}

const objectToString = (cookieObject) => {
  return Object.entries(cookieObject)
    .map((c) => c.join("="))
    .join("; ")
}

const plugin = fp(async function plugin(fastify) {
  fastify.decorate("mergeCookies", (oldCookie, newCookie) => {
    const mergedCookie = Object.assign(
      stringToObject(oldCookie),
      stringToObject(newCookie)
    )

    return objectToString(mergedCookie)
  })
})

export default plugin
