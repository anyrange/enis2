export default async function (fastify) {
  fastify.get("", { schema: { tags: ["miscellaneous"] } }, () => {
    return { message: "I'm alive" }
  })
}
