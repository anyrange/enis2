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

app.register(import("fastify-cookie"), { secret });

if (process.env.NODE_ENV !== "production") {
  app.ready(() => {
    console.log(app.printRoutes({ commonPrefix: false }));
  });
}

app.register(autoLoad, {
  dir: join(__dirname, "schema"),
});
app.register(autoLoad, {
  dir: join(__dirname, "plugins"),
});
app.register(autoLoad, {
  dir: join(__dirname, "routes"),
  routeParams: true,
});

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) return console.log(err);
  console.info(`App listening on: http://localhost:${PORT}`);
});
