import fetch from "node-fetch";
import { parseCookies } from "../../includes/parseCookies.js";
import { URLSearchParams } from "url";

export default async function(fastify) {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["login", "password", "captchaInput"],
          properties: {
            login: { type: "string", minLength: 12, maxLength: 12 },
            password: { type: "string", minLength: 1 },
            captchaInput: { type: "string" },
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
        params.append("login", req.body.login);
        params.append("password", req.body.password);
        params.append("captchaInput", req.body.captchaInput);

        const cookie = Object.entries(req.cookies)
          .map((cookie) => cookie.join("="))
          .join("; ");

        const response = await fetch(
          "https://sms.pvl.nis.edu.kz/root/Account/LogOn",
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
              path: process.env.FRONTEND_URI,
            });
          }
          reply.setCookie(cookie.name, cookie.value, {
            path: process.env.FRONTEND_URI,
            httpOnly: true,
          });
        });

        if (!body.success) return reply.code(403).send(body);

        console.log(req.body.login + " зашёл");

        reply.code(200).send(body);
      } catch (err) {
        console.log(err);
        reply.code(500).send({ message: "Что-то пошло не так!" });
      }
    }
  );
}
