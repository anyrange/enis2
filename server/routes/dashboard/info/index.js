import { URLSearchParams } from "url";

export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        query: {
          type: "object",
          required: ["journalId", "evalId", "city"],
          properties: {
            journalId: { type: "string", minLength: 36, maxLength: 36 },
            evalId: { type: "string", minLength: 36, maxLength: 36 },
            city: fastify.getSchema("city"),
          },
        },
        response: {
          200: {
            statusCode: { type: "number" },
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  Name: { type: "string" },
                  Score: { type: "number" },
                  MaxScore: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const params = new URLSearchParams();
      params.append("journalId", req.query.journalId);
      params.append("evalId", req.query.evalId);

      const cookie = fastify.cookieStringify(req.cookies);

      const response = await fastify.api({
        url: `https://sms.${req.query.city}.nis.edu.kz/Jce/Diary/GetResultByEvalution`,
        method: "POST",
        body: params,
        cookie,
      });

      reply.header("Cache-Control", "public, max-age=900").send(response);
    }
  );
}
