import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export default async function(fastify) {
  fastify.get("/aTIZzv3rWbge5tMjVidvF1RjIPPNP1Xn-3SEocSVkWM", (req, reply) => {
    fs.readFile(
      join(dirname(__filename), "../../../static/certificate"),
      (err, file) => {
        reply.send(file);
      }
    );
  });
}
