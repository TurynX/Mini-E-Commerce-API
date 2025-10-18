import jwt from "@fastify/jwt";
import type { FastifyInstance } from "fastify";
import dotenv from "dotenv";
import fastifyPlugin from "fastify-plugin";

dotenv.config();

export default fastifyPlugin(async function jwtPlugin(app: FastifyInstance) {
  app.register(jwt, { secret: process.env.JWT_SECRET || "supersecret" });

  app.decorate("authenticate", async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: "Unauthorized" });
    }
  });

  app.decorate("isAdmin", async (req: any, reply: any) => {
    if (!req.user || req.user.role !== "admin") {
      return reply.status(403).send({ message: "Acess denied: only Admin" });
    }
  });
});
