export default async function(fastify) {
  fastify.get(
    "",
    { schema: { querystring: fastify.getSchema("domain") } },
    async (req, reply) => {
      const city = req.query.city;

      const cookie = Object.entries(req.cookies)
        .map((cookie) => cookie.join("="))
        .join("; ");

      const { data } = await fastify.api({
        url: `https://${city}/Ref/GetSchoolYears?fullData=true`,
        cookie,
      });

      reply.header("Cache-Control", "public, max-age=900").send(data);
    }
  );
}
