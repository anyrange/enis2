import { URLSearchParams } from "url";
import currentQuarter from "../../../../utils/currentQuarter.js";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        params: {
          type: "object",
          required: ["yearID"],
          properties: {
            yearID: { type: "string", minLength: 36, maxLength: 36 },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: { type: "string" },
                Id: { type: "string" },
                isActual: { type: "boolean", default: false },
              },
            },
          },
        },
        tags: ["years"],
      },
    },
    async (req, reply) => {
      const cookie = req.cookies;

      const params = new URLSearchParams();
      params.append("schoolYearId", req.params.yearID);

      const periods = await fastify.api({
        method: "POST",
        url: `https://sms.${req.query.city}.nis.edu.kz/Ref/GetPeriods`,
        body: params,
        cookie,
      });

      periods.data[currentQuarter() - 1].isActual = true;
      reply.send(periods.data);
    }
  );
}
