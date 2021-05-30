import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default async function(fastify) {
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["journalId", "evalId", "city"],
          properties: {
            journalId: { type: "string", minLength: 36, maxLength: 36 },
            evalId: { type: "string", minLength: 36, maxLength: 36 },
            city: {
              type: "string",
              pattern:
                "^(sms.akt.nis.edu.kz|sms.akb.nis.edu.kz|sms.fmalm.nis.edu.kz|sms.hbalm.nis.edu.kz|sms.ast.nis.edu.kz|sms.atr.nis.edu.kz|sms.krg.nis.edu.kz|sms.kt.nis.edu.kz|sms.kst.nis.edu.kz|sms.kzl.nis.edu.kz|sms.pvl.nis.edu.kz|sms.ptr.nis.edu.kz|sms.sm.nis.edu.kz|sms.tk.nis.edu.kz|sms.trz.nis.edu.kz|sms.ura.nis.edu.kz|sms.ukk.nis.edu.kz|sms.fmsh.nis.edu.kz|sms.hbsh.nis.edu.kz)$",
            },
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
          `https://${req.query.city}/Jce/Diary/GetResultByEvalution`,
          {
            method: "POST",
            body: params,
            headers: { cookie },
          }
        );

        const body = await response.json();

        if (!body.success)
          return reply.code(400).send({ message: body.message });
        reply.code(200).send(body);
      } catch (err) {
        console.log(err);
        reply.code(500).send({ message: "Что-то пошло не так!" });
      }
    }
  );
}
