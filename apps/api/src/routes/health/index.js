export default async function (fastify) {
  fastify.get("", { schema: { tags: ["system"] } }, () => {
    return { message: "I'm alive" };
  });
}
