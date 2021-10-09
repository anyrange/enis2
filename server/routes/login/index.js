import { URLSearchParams } from "url";
import fetch from "node-fetch";

export default async function (fastify) {
  const querystring = fastify.getSchema("domain");
  fastify.post(
    "",
    {
      schema: {
        querystring,
        body: {
          type: "object",
          required: ["login", "password"],
          properties: {
            login: { type: "string", minLength: 12, maxLength: 12 },
            password: { type: "string", minLength: 1 },
            captchaInput: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  base64img: { type: "string" },
                },
              },
            },
          },
        },
        tags: ["login"],
      },
    },
    async (req, reply) => {
      const { login, password, captchaInput } = req.body;

      const params = new URLSearchParams();

      params.append("login", login);
      params.append("password", password);
      if (captchaInput) params.append("captchaInput", captchaInput);

      const cookie = fastify.cookieStringify(req.cookies);

      const res = await fetch(
        `https://sms.${req.query.city}.nis.edu.kz/root/Account/LogOn`,
        {
          method: "POST",
          headers: { cookie },
          body: params,
        }
      );

      const body = await res.json();
      const cookies = fastify.cookieParse(res);

      cookies.forEach(({ name, value }) => {
        reply.setCookie(name, value, fastify.cookieOptions);
      });

      const statusCode = body.success ? 200 : 400;
      body.data = Object.assign({}, body.data);
      reply.code(statusCode).send(body);
    }
  );
}
