import fastify from "fastify";
import { PROD, PORT, URL_WHITELIST, SECRET } from "./config";

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
  console.log(`Docs on: http://localhost:${PORT}/docs`);
}

app.register(import("@fastify/compress"));
app.register(import("./autoload"));

app.register(import("@fastify/jwt"), { secret: SECRET });

if (PROD) {
  app.listen(PORT, "0.0.0.0", (err) => {
    if (err) return console.log(err);
    console.info(`App is alive on port ${PORT}`);
  });
}

export const viteNodeApp = app;
