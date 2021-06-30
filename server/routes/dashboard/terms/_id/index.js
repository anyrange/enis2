import fetch from "node-fetch";
import { URLSearchParams } from "url";

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
        response: {
          200: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: { type: "string" },
                    JournalId: { type: "string" },
                    Score: { type: "number" },
                    Mark: { type: "number" },
                    Id: { type: "string" },
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
          },
        },
      },
    },
    async (req, reply) => {
      const city = req.query.city;
      let cookie = fastify.cookieStringify(req.cookies);

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

      const newCookies = fastify.cookieParse(cookieResponse);

      if (newCookies.length) {
        const [name, value] = newCookies[0];
        cookie += "; " + name + "=" + value;

        reply.setCookie(name, value, fastify.cookieOptions);
      }

      const periodsData = await fastify.api({
        url: `https://${city}/Jce/Diary/GetSubjects`,
        method: "POST",
        body: params,
        cookie,
      });

      reply.header("Cache-Control", "public, max-age=900").send({
        data: periodsData.data.map((el) => {
          return {
            ...el,
            Evaluations: el.Evaluations.map((el2) => el2.Id),
          };
        }),
        statusCode: periodsData.statusCode,
      });
    }
  );
}
