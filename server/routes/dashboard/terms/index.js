import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default async function(fastify) {
  const querystring = fastify.getSchema("domain");
  fastify.get(
    "/",
    { schema: { querystring }, attachValidation: true },
    async (req, reply) => {
      try {
        if (req.validationError)
          return reply.code(404).send({ message: "Invalid data" });

        const city = req.query.city;

        const cookie = Object.entries(req.cookies)
          .map((cookie) => cookie.join("="))
          .join("; ");

        const dates = await dateAPI(cookie, city);

        if (typeof dates === "string")
          return reply.code(400).send({ message: dates });

        if (!dates.success)
          return reply.code(400).send({ message: dates.message });

        const periods = await periodAPI(
          cookie,
          dates.data?.find((date) => date.Data.IsActual).Id,
          city
        );

        if (!periods.success)
          return reply.code(400).send({ message: periods.message });

        reply.code(200).send(periods.data);
      } catch (err) {
        console.log(err);
        reply.code(500).send({ message: "Что-то пошло не так!" });
      }
    }
  );
}

const dateAPI = async (cookie, city) => {
  return await fetch(`https://${city}/Ref/GetSchoolYears?fullData=true`, {
    headers: { cookie },
  })
    .then(async (res) => {
      const sessionExpiredText = await res.text();
      if (
        sessionExpiredText ===
        "Сессия пользователя была завершена, перезагрузите страницу"
      )
        return sessionExpiredText;

      return JSON.parse(sessionExpiredText);
    })
    .catch((err) => {
      throw err;
    });
};

const periodAPI = async (cookie, year, city) => {
  const params = new URLSearchParams();
  params.append("schoolYearId", year);

  return await fetch(`https://${city}/Ref/GetPeriods`, {
    method: "POST",
    headers: { cookie },
    body: params,
  })
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });
};
