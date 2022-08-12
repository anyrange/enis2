import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fastify from "fastify";
import autoload from "@fastify/autoload";
import { PROD, PORT, URL_WHITELIST, SECRET } from "./config/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = fastify({ trustProxy: true });

app.register(import("@fastify/cors"), {
  origin: URL_WHITELIST.split(","),
  credentials: true,
});

if (!PROD) {
  app.register(import("@fastify/swagger"), {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "enis2",
        description: "enis2 API documentation",
      },
    },
    uiConfig: {
      deepLinking: true,
      docExpansion: "none",
      displayRequestDuration: true,
    },
    exposeRoute: true,
  });
  console.log(`Docs on: http://localhost:${PORT}/docs`);
}

app.register(import("@fastify/compress"));

app.register(autoload, { dir: join(__dirname, "schema") });
app.register(autoload, { dir: join(__dirname, "plugins") });
app.register(autoload, {
  dir: join(__dirname, "routes"),
  routeParams: true,
});

app.register(import("@fastify/jwt"), { secret: SECRET });

app.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) return console.log(err);
  console.info(`App is alive on port ${PORT}`);
});
