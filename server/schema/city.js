import fp from "fastify-plugin";
import schools from "#shared/schools.js";

const cityValues = schools.map((school) => school.value);

export default fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "city",
    title: "City",
    type: "string",
    enum: cityValues,
    default: "pvl",
  });
});
