import fastify from "fastify";
import jwtPlugin from "./Plugins/jwt.js";
import { appRoutes } from "./Routes/routes.js";

const app = fastify();

app.register(jwtPlugin);
app.register(appRoutes);

app.listen({ port: 3333 });
