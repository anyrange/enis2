import fetch from "node-fetch"
import { FAKE_USER_AGENT } from "../../../config/index.js"

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        headers: fastify.getSchema("token"),
        querystring: {
          type: "object",
          required: ["city", "yearID"],
          properties: {
            city: fastify.getSchema("city"),
            yearID: { type: "string" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                SubjectName: { type: "string" },
                FirstPeriod: { type: "string" },
                SecondPeriod: { type: "string" },
                FirstHalfYear: { type: "string" },
                ThirdPeriod: { type: "string" },
                ForthPeriod: { type: "string" },
                SecondHalfYear: { type: "string" },
                Exam: { type: "string" },
                Year: { type: "string" },
                Final: { type: "string" },
              },
            },
          },
        },
        tags: ["dashboard"],
      },
    },
    async (req, reply) => {
      const { city, yearID } = req.query
      const baseUrl = `https://sms.${city}.nis.edu.kz`

      const params = new URLSearchParams()
      const cookie = req.cookies

      const organization = await fastify.api({
        method: "POST",
        cookie,
        url: `${baseUrl}/reportcard/GetOrganizations`,
      })

      params.append("schoolYearId", yearID)
      params.append("organizationId", organization.data[0].Id)
      params.append("organizationInternalId", organization.data[0].Id)

      const parallels = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `${baseUrl}/reportcard/GetParallels`,
      })

      params.append("parallelId", parallels.data[0].Id)

      const klasses = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `${baseUrl}/reportcard/GetKlasses`,
      })

      params.append("klassId", klasses.data[0].Id)

      const students = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `${baseUrl}/reportcard/GetStudents`,
      })

      params.append("personId", students.data[0].Id)
      params.append("isEditable", true)
      params.append("group", { property: "ComponentId", direction: "ASC" })

      const { data: url, cookie: resCookie } = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `${baseUrl}/reportcard/GetUrl`,
      })

      const newCookies = fastify.mergeCookies(cookie, resCookie)

      await fetch(url, {
        headers: {
          cookie: newCookies,
          "user-agent": FAKE_USER_AGENT,
        },
      })

      const grades = await fastify.api({
        method: "POST",
        body: params,
        cookie: newCookies,
        url: `${baseUrl}/ReportCardByStudent/GetData`,
      })

      const array = grades.data.filter(
        (grade) =>
          grade.IsNotChosen && grade.ComponentName === "Инвариантный компонент"
      )

      // remove item duplicates
      await reply.send([
        ...new Map(array.map((item) => [item["SubjectName"], item])).values(),
      ])
    }
  )
}
