import fetch from "node-fetch"
import { promisify } from "util"
import { fakeUserAgent } from "../../../config/index.js"

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        headers: fastify.getSchema("token"),
        response: {
          200: {
            type: "object",
            properties: {
              captcha: { type: "string" },
              token: { type: "string" },
            },
          },
        },
        tags: ["login"],
      },
    },
    async (req, reply) => {
      const { cookies: cookie, account } = req

      const initialCityCookie = await fetch(
        `https://sms.${req.query.city}.nis.edu.kz/root/Account/Login`,
        {
          method: "GET",
          headers: {
            "user-agent": fakeUserAgent,
          },
        }
      ).then(async (res) => fastify.cookieParse(res))

      const cookies = fastify.mergeCookies(cookie, initialCityCookie)
      const response = await fetch(
        `https://sms.${req.query.city}.nis.edu.kz/root/Account/RefreshCaptcha`,
        { headers: { cookie: cookies } }
      ).then((res) => res.json())

      if (!response.data?.base64img)
        return reply
          .code(400)
          .send({ message: response.message || "Что-то пошло не так" })

      const promiseJWT = promisify(fastify.jwt.sign)
      const token = await promiseJWT({ cookies, account }, null)

      return reply.code(200).send({ captcha: response.data.base64img, token })
    }
  )
}
