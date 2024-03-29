import fetch from "node-fetch"
import { URLSearchParams } from "url"

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        headers: fastify.getSchema("token"),
        params: {
          type: "object",
          required: ["termID"],
          properties: {
            termID: { type: "string", minLength: 36, maxLength: 36 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    Name: { type: "string" },
                    JournalId: { type: "string" },
                    Score: { type: "number" },
                    Mark: { type: "number" },
                    Evaluations: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                },
              },
              token: { type: "string" },
            },
          },
        },
        tags: ["dashboard"],
      },
    },
    async (req, reply) => {
      const baseUrl = `https://sms.${req.query.city}.nis.edu.kz`

      let cookie = req.cookies

      const params = new URLSearchParams()
      params.append("periodId", req.params.termID)

      const parallel = await fastify.api({
        url: `${baseUrl}/JceDiary/GetParallels`,
        method: "POST",
        body: params,
        cookie,
      })

      params.append("parallelId", parallel.data[0].Id)

      const klasses = await fastify.api({
        url: `${baseUrl}/JceDiary/GetKlasses`,
        method: "POST",
        body: params,
        cookie,
      })

      const realKlass =
        klasses.data.length === 1
          ? klasses.data[0]
          : klasses.data.find((cur, id) => {
              if (id === 0) return false

              return klasses.data[id - 1].Id === cur.Id
            })

      if (!realKlass) {
        const err = new Error("Класс ученика не найден")
        err.code = 404
        throw err
      }

      params.append("klassId", realKlass.Id)

      const student = await fastify.api({
        url: `${baseUrl}/JceDiary/GetStudents`,
        method: "POST",
        body: params,
        cookie,
      })

      params.append("studentId", student.data[0].Id)

      const diaryLink = await fastify.api({
        url: `${baseUrl}/JceDiary/GetJceDiary`,
        method: "POST",
        body: params,
        cookie,
      })

      const cookieResponse = await fetch(diaryLink.data.Url, {
        method: "POST",
        headers: { cookie },
        body: params,
      })

      const newCookies = fastify.cookieParse(cookieResponse)

      if (newCookies) cookie = fastify.mergeCookies(cookie, newCookies)

      const periodsData = await fastify.api({
        url: `${baseUrl}/Jce/Diary/GetSubjects`,
        method: "POST",
        body: params,
        cookie,
      })

      const signJWT = new Promise((resolve, reject) => {
        fastify.jwt.sign(
          { cookies: cookie, account: req.account },
          null,
          (err, token) => {
            if (err) return reject(err)
            resolve(token)
          }
        )
      })

      const token = await signJWT

      await reply.send({
        data: periodsData.data.map((el) => ({
          ...el,
          Evaluations: el.Evaluations.map((el2) => el2.Id),
        })),
        token,
      })
    }
  )
}
