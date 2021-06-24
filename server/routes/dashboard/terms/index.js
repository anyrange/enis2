import { URLSearchParams } from "url";

export default async function(fastify) {
  fastify.get(
    "",
    { schema: { querystring: fastify.getSchema("domain") } },
    async (req, reply) => {
      const city = req.query.city;

      const cookie = Object.entries(req.cookies)
        .map((cookie) => cookie.join("="))
        .join("; ");

      const dates = await fastify.api({
        url: `https://${city}/Ref/GetSchoolYears?fullData=true`,
        cookie,
      });

      const params = new URLSearchParams();
      params.append(
        "schoolYearId",
        dates.data?.find((date) => date.Data.IsActual).Id
      );

      const periods = await fastify.api({
        method: "POST",
        url: `https://${city}/Ref/GetPeriods`,
        body: params,
        cookie,
      });

      reply.code(200).send(periods.data);
    }
  );
}
