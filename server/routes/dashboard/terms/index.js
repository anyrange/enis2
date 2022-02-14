import { URLSearchParams } from "url";
import currentQuarter from "#root/utils/currentQuarter.js";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        description: "Terms of current year",
        querystring: fastify.getSchema("domain"),
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
        tags: ["terms"],
      },
    },
    async (req, reply) => {
      const baseUrl = `https://sms.${req.query.city}.nis.edu.kz/Ref`;

      const cookie = req.cookies;

      const dates = await fastify.api({
        url: `${baseUrl}/GetSchoolYears?fullData=true`,
        cookie,
      });

      const params = new URLSearchParams();

      const actualYear = dates.data?.find((date) => date.Data.IsActual);
      params.append("schoolYearId", actualYear.Id);

      const periods = await fastify.api({
        method: "POST",
        url: `${baseUrl}/GetPeriods`,
        body: params,
        cookie,
      });

      periods.data[currentQuarter() - 1].isActual = true;
      reply.send(periods.data);
    }
  );
}
