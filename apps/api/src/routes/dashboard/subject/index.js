import { URLSearchParams } from "url"

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        headers: fastify.getSchema("token"),
        querystring: {
          type: "object",
          required: ["journalId", "evaluations[]", "city"],
          properties: {
            journalId: { type: "string", minLength: 36, maxLength: 36 },
            "evaluations[]": {
              type: "array",
              items: { type: "string", minLength: 36, maxLength: 36 },
            },
            city: fastify.getSchema("city"),
            token: { type: "string" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  Name: { type: "string" },
                  Score: { type: "number" },
                  MaxScore: { type: "number" },
                  SectionId: { type: "string" },
                  RubricId: { type: "string" },
                },
              },
            },
          },
        },
        tags: ["dashboard"],
      },
    },
    async (req, reply) => {
      const evaluations = req.query["evaluations[]"]

      const createSubjectPromise = async (evalId) => {
        const params = new URLSearchParams()
        params.append("journalId", req.query.journalId)
        params.append("evalId", evalId)

        const cookie = req.cookies
        const response = await fastify.api({
          url: `https://sms.${req.query.city}.nis.edu.kz/Jce/Diary/GetResultByEvalution`,
          method: "POST",
          body: params,
          cookie,
        })
        response.data.forEach((item) => (item.SectionId = item.Id))
        return response.data
      }

      const subject = await Promise.all([
        createSubjectPromise(evaluations[0]),
        createSubjectPromise(evaluations[1]),
      ])

      await reply.send(subject)
    }
  )
}
