export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Name: { type: "string" },
                Id: { type: "string" },
                isActual: { type: "boolean" },
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const cookie = fastify.cookieStringify(req.cookies);

      const { data: years } = await fastify.api({
        url: `https://sms.${req.query.city}.nis.edu.kz/Ref/GetSchoolYears?fullData=true`,
        cookie,
      });

      reply.header("Cache-Control", "public, max-age=900").send(
        years.map((year) => {
          return { Name: year.Name, Id: year.Id, isActual: year.Data.IsActual };
        })
      );
    }
  );
}
