import { URLSearchParams } from "url";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        headers: fastify.getSchema("token"),
        querystring: {
          type: "object",
          required: ["sectionId", "rubricId", "city"],
          properties: {
            sectionId: { type: "string", minLength: 36, maxLength: 36 },
            rubricId: { type: "string", minLength: 36, maxLength: 36 },
            city: fastify.getSchema("city"),
            token: { type: "string" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                criterion: { type: "string" },
                descriptors: {
                  type: "array",
                  items: { type: "string" },
                },
                resultId: { type: "number" },
              },
            },
          },
        },
        tags: ["dashboard"],
      },
    },
    async (req, reply) => {
      const params = new URLSearchParams();
      params.append("sectionId", req.query.sectionId);
      params.append("rubricId", req.query.rubricId);

      const cookie = req.cookies;

      const response = await fastify.api({
        url: `https://sms.${req.query.city}.nis.edu.kz/Jce/Diary/GetRubricResults`,
        method: "POST",
        body: params,
        cookie,
      });

      const resultTypes = ["HighResult", "MediumResult", "LowResult"];

      response.data.forEach((criterion) => {
        criterion.resultId = resultTypes.findIndex((type) => criterion[type]);
        criterion.criterion = criterion.Criterion;
        criterion.descriptors = [
          criterion.HighDescriptor,
          criterion.MediumDescriptor,
          criterion.LowDescriptor,
        ];
      });

      reply.send(response.data);
    }
  );
}
