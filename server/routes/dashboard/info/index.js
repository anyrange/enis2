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
      },
    },
    async (req, reply) => {
      const params = new URLSearchParams();
      params.append("journalId", req.query.journalId);
      params.append("evalId", req.query.evalId);

      const cookie = Object.entries(req.cookies)
        .map((cookie) => cookie.join("="))
        .join("; ");

      const response = await fastify.api({
        url: `https://${req.query.city}/Jce/Diary/GetResultByEvalution`,
        method: "POST",
        body: params,
        cookie,
      });

      reply.header("Cache-Control", "public, max-age=900").send(response);
    }
  );
}
