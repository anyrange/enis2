import fp from "fastify-plugin";

export default fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "city",
    title: "City",
    type: "string",
    pattern:
      "^(akt|akb|fmalm|hbalm|ast|atr|krg|kt|kst|kzl|pvl|ptr|sm|tk|trz|ura|ukk|fmsh|hbsh)$",
  });
});
