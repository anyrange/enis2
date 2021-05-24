// import fetch from "node-fetch";

export default async function(fastify) {
  fastify.get("/", async (req, reply) => {
    try {
      reply.code(200).send({ message: "" });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Что-то пошло не так!" });
    }
  });
}
