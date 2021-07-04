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
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: { type: "string" },
                Id: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const cookie = fastify.cookieStringify(req.cookies);

      const params = new URLSearchParams();
      params.append("schoolYearId", req.params.id);

      const periods = await fastify.api({
        method: "POST",
        url: `https://sms.${req.query.city}.nis.edu.kz/Ref/GetPeriods`,
        body: params,
        cookie,
      });

      reply.send(periods.data);
    }
  );
}
