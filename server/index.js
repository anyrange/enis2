import fastify from "fastify";
import autoLoad from "fastify-autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();
const app = fastify();

const PORT = process.env.PORT || 8887;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const secret = process.env.SECRET || "secret";
const FRONTEND_URI = process.env.FRONTEND_URI.split(",");

app.register(import("fastify-cors"), {
  origin: FRONTEND_URI,
  credentials: true,
});

app.register(import("fastify-cookie"), {
  secret, // for cookies signature
  parseOptions: {}, // options for parsing cookies
});

app.addSchema({
  $id: "domain",
  type: "object",
  required: ["city"],
  properties: {
    city: {
      type: "string",
      pattern:
        "^(sms.akt.nis.edu.kz|sms.akb.nis.edu.kz|sms.fmalm.nis.edu.kz|sms.hbalm.nis.edu.kz|sms.ast.nis.edu.kz|sms.atr.nis.edu.kz|sms.krg.nis.edu.kz|sms.kt.nis.edu.kz|sms.kst.nis.edu.kz|sms.kzl.nis.edu.kz|sms.pvl.nis.edu.kz|sms.ptr.nis.edu.kz|sms.sm.nis.edu.kz|sms.tk.nis.edu.kz|sms.trz.nis.edu.kz|sms.ura.nis.edu.kz|sms.ukk.nis.edu.kz|sms.fmsh.nis.edu.kz|sms.hbsh.nis.edu.kz)$",
    },
  },
});

app.register(autoLoad, {
  dir: join(__dirname, "routes"),
  routeParams: true,
});

app.all("/*", (request, reply) => {
  reply.code(404).send({ message: "Service not found" });
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});

// app.ready(() => {
//   console.log(app.printRoutes({ commonPrefix: false }));
// });

app.listen(PORT, "0.0.0.0", (err, address) => {
  if (err) return console.log(err);
  console.info(`App listening on: ${address}`);
});
