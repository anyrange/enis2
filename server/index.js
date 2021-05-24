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
const FRONTEND_URI = process.env.FRONTEND_URI;

app.register(import("fastify-cors"), {
  origin: FRONTEND_URI,
  credentials: true,
});

app.register(import("fastify-cookie"), {
  secret, // for cookies signature
  parseOptions: {}, // options for parsing cookies
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

app.listen(PORT, "0.0.0.0", (err, address) => {
  if (err) return console.log(err);
  console.info(`App listening on: ${address}`);
});
