import fetch from "node-fetch";
import { parseCookies } from "../../includes/parseCookies.js";
import { URLSearchParams } from "url";

export default async function(fastify) {
  // const querystring = fastify.getSchema("domain");
  // api is shit as hell in order to avoid mobile chrome protection
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["city", "login", "password", "captchaInput"],
          properties: {
            login: { type: "string", minLength: 12, maxLength: 12 },
            password: { type: "string", minLength: 1 },
            captchaInput: { type: "string" },
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
        params.append("login", req.query.login);
        params.append("password", req.query.password);
        params.append("captchaInput", req.query.captchaInput);

        const cookie = Object.entries(req.cookies)
          .map((cookie) => cookie.join("="))
          .join("; ");

        const response = await fetch(
          `https://${req.query.city}/root/Account/LogOn`,
          {
            method: "POST",
            body: params,
            headers: { cookie },
          }
        );

        const body = await response.json();
        const cookies = parseCookies(response);

        cookies.forEach((cookie) => {
          if (cookie.name == "lang") {
            reply.setCookie(cookie.name, cookie.value, {
              path: "/",
            });
          }
          reply.setCookie(cookie.name, cookie.value, {
            path: "/",
            httpOnly: true,
          });
        });

        if (!body.success) return reply.code(403).send(body);

        console.log(req.query.login + " зашёл");

        reply.code(200).send(body);
      } catch (err) {
        console.log(err);
        reply.code(500).send({ message: "Что-то пошло не так!" });
      }
    }
  );
}
