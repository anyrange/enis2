import fastify from "fastify";
import autoLoad from "fastify-autoload";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const app = fastify({ trustProxy: true });

const PORT = process.env.PORT || 8887;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const secret = process.env.SECRET || "secret";
const URL_WHITELIST = process.env.URL_WHITELIST.split(",");

app.register(import("fastify-cors"), {
  origin: URL_WHITELIST,
  credentials: true,
});

app.register(import("fastify-cookie"), { secret });

if (process.env.NODE_ENV !== "production") {
  app.register(import("fastify-swagger"), {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "ENIS2",
        description: "ENIS2 API documentation",
      },
    },
    uiConfig: {
      deepLinking: true,
      docExpansion: "none",
      displayRequestDuration: true,
    },
    exposeRoute: true,
  });
}

app.register(autoLoad, { dir: join(__dirname, "schema") });
app.register(autoLoad, { dir: join(__dirname, "plugins") });
app.register(autoLoad, {
  dir: join(__dirname, "routes"),
  routeParams: true,
});

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) return console.log(err);
  console.info(`App is alive. Docs on: http://localhost:${PORT}/docs`);
});
