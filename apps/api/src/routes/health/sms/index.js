import fetch from "node-fetch"
import schools from "nis-schools"

const SECOND = 1000

const schoolCodes = schools.map(({ value }) => value)

const smsStatus = {}
schoolCodes.forEach((code) => (smsStatus[code] = true))

const getStatus = (key) => {
  if (key) return { alive: smsStatus[key] }

  return smsStatus
}

let isValidStatus = false

const fetchStatus = async (code) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15 * SECOND)

  try {
    const res = await fetch(`https://sms.${code}.nis.edu.kz/root`, {
      redirect: "manual",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    return res.status < 400
  } catch {
    return false
  }
}

const updateStatus = async () => {
  const newStates = await Promise.all(
    schoolCodes.map((code) => fetchStatus(code))
  )

  newStates.forEach((status, id) => (smsStatus[schoolCodes[id]] = status))
}

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        tags: ["miscellaneous"],
      },
    },
    async (req, reply) => {
      if (isValidStatus) return reply.send(getStatus(req.query.city))

      try {
        await updateStatus()
        isValidStatus = true

        setTimeout(() => (isValidStatus = false), 60 * SECOND)
      } finally {
        reply.send(getStatus(req.query.city))
      }
    }
  )
}
