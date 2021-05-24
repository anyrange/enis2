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
          required: ["login", "password"],
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
      if (req.validationError)
        return reply.code(404).send({ message: "Invalid data" });

      console.log(req.body.login);

      const params = new URLSearchParams();
      params.append("login", req.body.login);
      params.append("password", req.body.password);

      req.body.captchaInput &&
        params.append("captchaInput", req.body.captchaInput);

      const aboba = await fetch(
        "https://sms.pvl.nis.edu.kz/root/Account/LogOn",
        {
          method: "POST",
          body: params,
        }
      ).catch((err) => {
        console.log(err);
      });

      const body = await aboba.json();
      const cookies = parseCookies(aboba);

      cookies.forEach((cookie) =>
        reply.setCookie(cookie.name, cookie.value, {
          path: process.env.FRONTEND_URI,
          httpOnly: true,
        })
      );
      reply.code(200).send(body);
    }
  );
}
