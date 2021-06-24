import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { parseCookies } from "../../../../includes/parseCookies.js";

export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", minLength: 36, maxLength: 36 } },
        },
      },
    },
    async (req, reply) => {
      const city = req.query.city;

      let cookie = Object.entries(req.cookies)
        .map((cookie) => cookie.join("="))
        .join("; ");

      const params = new URLSearchParams();
      params.append("periodId", req.params.id);

      const parallel = await fastify.api({
        url: `https://${city}/JceDiary/GetParallels`,
        method: "POST",
        body: params,
        cookie,
      });

      params.append("parallelId", parallel.data[0].Id);

      const klasses = await fastify.api({
        url: `https://${city}/JceDiary/GetKlasses`,
        method: "POST",
        body: params,
        cookie,
      });

      params.append("klassId", klasses.data[0].Id);

      const student = await fastify.api({
        url: `https://${city}/JceDiary/GetStudents`,
        method: "POST",
        body: params,
        cookie,
      });

      params.append("studentId", student.data[0].Id);

      const diaryLink = await fastify.api({
        url: `https://${city}/JceDiary/GetJceDiary`,
        method: "POST",
        body: params,
        cookie,
      });

      const cookieResponse = await fetch(diaryLink.data.Url, {
        method: "POST",
        headers: { cookie },
        body: params,
      });

      const newCookies = parseCookies(cookieResponse);
      const smsCookie =
        newCookies && newCookies.find((cookie) => cookie.name !== "lang");

      if (smsCookie) {
        cookie = cookie + "; " + smsCookie.name + "=" + smsCookie.value;

        const url = new URL(process.env.FRONTEND_URI);

        const year = 60 * 60 * 24 * 365;

        reply.setCookie(smsCookie.name, smsCookie.value, {
          path: "/",
          sameSite: "strict",
          secure: true,
          domain: url.hostname,
          httpOnly: true,
          maxAge: year,
        });
      }

      const periodsData = await fastify.api({
        url: `https://${city}/Jce/Diary/GetSubjects`,
        method: "POST",
        body: params,
        cookie,
      });

      reply.code(200).send(periodsData);
    }
  );
}
