import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { appRoutes } from "./Routes/routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = fastify();

app.register(fastifyJwt, { secret: process.env.JWT_SECRET || "supersecret" });

app.decorate("authenticate", async (req: any, reply: any) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: "Unauthorized" });
  }
});

app.register(appRoutes);

app.listen({ port: 3333 });
