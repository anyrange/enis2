export default async function (fastify) {
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
        tags: ["years"],
      },
    },
    async (req, reply) => {
      const cookie = req.cookies;

      const { data: years } = await fastify.api({
        url: `https://sms.${req.query.city}.nis.edu.kz/Ref/GetSchoolYears?fullData=true`,
        cookie,
      });

      reply.send(
        years.map((year) => {
          return { Name: year.Name, Id: year.Id, isActual: year.Data.IsActual };
        })
      );
    }
  );
}
