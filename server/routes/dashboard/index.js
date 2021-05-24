import fetch from "node-fetch";

export default async function(fastify) {
  fastify.get("/", async (req, reply) => {
    try {
      const cookie = Object.entries(req.cookies)
        .map((cookie) => cookie.join("="))
        .join("; ");

      const dates = await dateAPI(cookie);

      if (typeof dates === "string")
        return reply.code(400).send({ message: dates });

      if (!dates.success)
        return reply.code(400).send({ message: dates.message });

      reply.code(200).send({ message: dates.data });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Что-то пошло не так!" });
    }
  });
}

const dateAPI = async (cookie) => {
  return await fetch(
    "https://sms.pvl.nis.edu.kz/Ref/GetSchoolYears?fullData=true",
    {
      headers: { cookie },
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });
};
