import fastify from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: any, reply: any) => Promise<void>;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    isAdmin: (req: any, reply: any) => Promise<void>;
  }
}
