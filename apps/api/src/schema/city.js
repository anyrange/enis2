import fp from "fastify-plugin"
import { SCHOOLS } from "@enis2/shared"

const cityValues = SCHOOLS.map((school) => school.value)

export default fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "city",
    title: "City",
    type: "string",
    enum: cityValues,
  })
})
