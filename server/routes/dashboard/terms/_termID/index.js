import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        params: {
          type: "object",
          required: ["termID"],
          properties: {
            termID: { type: "string", minLength: 36, maxLength: 36 },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: { type: "string" },
                JournalId: { type: "string" },
                Score: { type: "number" },
                Mark: { type: "number" },
                Evaluations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        tags: ["terms"],
      },
    },
    async (req, reply) => {
      const baseUrl = `https://sms.${req.query.city}.nis.edu.kz`;

      let cookie = fastify.cookieStringify(req.cookies);

      const params = new URLSearchParams();
      params.append("periodId", req.params.termID);

      const parallel = await fastify.api({
        url: `${baseUrl}/JceDiary/GetParallels`,
        method: "POST",
        body: params,
        cookie,
      });

      params.append("parallelId", parallel.data[0].Id);

      const klasses = await fastify.api({
        url: `${baseUrl}/JceDiary/GetKlasses`,
        method: "POST",
        body: params,
        cookie,
      });

      params.append("klassId", klasses.data[0].Id);

      const student = await fastify.api({
        url: `${baseUrl}/JceDiary/GetStudents`,
        method: "POST",
        body: params,
        cookie,
      });

      params.append("studentId", student.data[0].Id);

      const diaryLink = await fastify.api({
        url: `${baseUrl}/JceDiary/GetJceDiary`,
        method: "POST",
        body: params,
        cookie,
      });

      const cookieResponse = await fetch(diaryLink.data.Url, {
        method: "POST",
        headers: { cookie },
        body: params,
      });

      const newCookies = fastify.cookieParse(cookieResponse);

      if (newCookies.length) {
        const { name, value } = newCookies[0];
        cookie += "; " + name + "=" + value;

        reply.setCookie(name, value, fastify.cookieOptions);
      }

      const periodsData = await fastify.api({
        url: `${baseUrl}/Jce/Diary/GetSubjects`,
        method: "POST",
        body: params,
        cookie,
      });

      reply.send(
        periodsData.data.map((el) => {
          return {
            ...el,
            Evaluations: el.Evaluations.map((el2) => el2.Id),
          };
        })
      );
    }
  );
}