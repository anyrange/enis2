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
      const city = req.query.city;

      const cookie = fastify.cookieStringify(req.cookies);

      const { data } = await fastify.api({
        url: `https://${city}/Ref/GetSchoolYears?fullData=true`,
        cookie,
      });

      reply.header("Cache-Control", "public, max-age=900").send(
        data.map((el) => {
          return { Name: el.Name, Id: el.Id, isActual: el.Data.IsActual };
        })
      );
    }
  );
}
