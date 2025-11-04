import fastify from "fastify";
import jwtPlugin from "./Plugins/jwt.js";
import { appRoutes } from "./Routes/routes.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

const app = fastify();

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Mini E-Commerce API",
      version: "1.0.0",
      description: "Swagger docs for TurynX's backend",
    },
  },
});

await app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.register(jwtPlugin);
app.register(appRoutes);

await app.ready();
app.swagger();

app.listen({ port: 3333 });
