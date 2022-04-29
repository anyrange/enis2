import fetch from "node-fetch";
import { IPINFO_TOKEN } from "@/config";

export default async function (fastify) {
  fastify.get(
    "",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              city: { type: "string" },
              region: { type: "string" },
            },
          },
        },
        tags: ["miscellaneous"],
      },
    },
    async (req, reply) => {
      const token = IPINFO_TOKEN;

      const requestIp = req.ips[req.ips.length - 1];

      const res = await fetch(
        `https://ipinfo.io/${requestIp}/json?token=${token}`
      ).then((res) => res.json());

      reply.send({ city: res.city || "", region: res.region || "" });
    }
  );
}
