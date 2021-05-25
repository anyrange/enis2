import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default async function(fastify) {
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["journalId", "evalId"],
          properties: {
            journalId: { type: "string", minLength: 36, maxLength: 36 },
            evalId: { type: "string", minLength: 36, maxLength: 36 },
          },
        },
      },
      attachValidation: true,
    },
    async (req, reply) => {
      try {
        if (req.validationError)
          return reply.code(404).send({ message: "Invalid data" });

        const params = new URLSearchParams();
        params.append("journalId", req.query.journalId);
        params.append("evalId", req.query.evalId);

        const cookie = Object.entries(req.cookies)
          .map((cookie) => cookie.join("="))
          .join("; ");

        const response = await fetch(
          "https://sms.pvl.nis.edu.kz/Jce/Diary/GetResultByEvalution?_dc=1621922724082",
          {
            method: "POST",
            body: params,
            headers: { cookie },
          }
        );

        const body = await response.json();

        reply.code(200).send(body);
      } catch (err) {
        console.log(err);
        reply.code(500).send({ message: "Что-то пошло не так!" });
      }
    }
  );
}
