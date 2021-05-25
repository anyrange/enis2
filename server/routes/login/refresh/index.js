import fetch from "node-fetch";

export default async function(fastify) {
  fastify.get("/", async (req, reply) => {
    try {
      const cookie = Object.entries(req.cookies)
        .map((cookie) => cookie.join("="))
        .join("; ");

      const response = await fetch(
        "https://sms.pvl.nis.edu.kz/root/Account/RefreshCaptcha",
        {
          headers: { cookie },
        }
      );

      const body = await response.json();

      if (!body.data.base64img)
        return reply.code(400).send({ message: "Что-то пошло не так" });

      reply.code(200).send({ base54img: body.data.base64img });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Что-то пошло не так" });
    }
  });
}
