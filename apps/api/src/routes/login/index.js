import { URLSearchParams } from "url"
import { promisify } from "util"
import fetch from "node-fetch"
import { encrypt, decrypt } from "../../utils/crypto.js"
import { fakeUserAgent } from "../../config/index.js"

const getDecryptedPassword = (password) => {
  return password?.content ? decrypt(password) : password
}

export default async function (fastify) {
  fastify.post(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        headers: fastify.getSchema("token"),
        body: {
          type: "object",
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
              token: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              message: { type: "string" },
              token: { type: "string" },
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
      const { captchaInput } = req.body
      const { cookies: cookie, account } = req

      const login = req.body.login || account?.login

      const password =
        req.body.password || getDecryptedPassword(account?.password)

      if (!(login && password))
        return reply
          .code(401)
          .send({ message: "Neither token nor credentials were provided" })

      const params = new URLSearchParams()
      params.append("login", login)
      params.append("password", password)
      if (captchaInput) params.append("captchaInput", captchaInput)

      const res = await fetch(
        `https://sms.${req.query.city}.nis.edu.kz/root/Account/LogOn`,
        {
          method: "POST",
          headers: {
            cookie,
            "user-agent": fakeUserAgent,
          },
          body: params,
        }
      )

      const body = await res.json()

      const newCookie = fastify.cookieParse(res)
      const cookies = fastify.mergeCookies(cookie, newCookie)

      const promiseJWT = promisify(fastify.jwt.sign)

      body.token = await promiseJWT(
        {
          cookies,
          account: {
            login,
            password: encrypt(password),
          },
        },
        null
      )

      const statusCode = body.success ? 200 : 400
      body.data = Object.assign({}, body.data)

      return reply.code(statusCode).send(body)
    }
  )
}
