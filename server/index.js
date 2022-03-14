import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import fastify from "fastify";
import autoLoad from "fastify-autoload";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = fastify({ trustProxy: true });

const PORT = process.env.PORT || 8887;
const SECRET = process.env.SECRET || "secret";
const URL_WHITELIST = process.env.URL_WHITELIST || "http://localhost:3004";

app.register(import("fastify-cors"), {
  origin: URL_WHITELIST.split(","),
  credentials: true,
});

app.register(import("fastify-compress"));

app.register(import("fastify-jwt"), { secret: SECRET });

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
