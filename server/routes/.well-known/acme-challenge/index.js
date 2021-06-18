import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export default async function(fastify) {
  fastify.get("/zsCoGzILS5mnrpQMB27gqN_XQz5aOdua2kygclQ_IH4", (req, reply) => {
    fs.readFile(
      join(dirname(__filename), "../../../static/certificate"),
      (err, file) => {
        reply.send(file);
      }
    );
  });
}
