import type { FastifyReply, FastifyRequest } from "fastify";
import { registerBodySchema, loginBodySchema } from "../schemas/schema.js";
import { registerUser, validateUser } from "../services/auth.services.js";

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const result = registerBodySchema.safeParse(req.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "ValidationError",
      details: result.error.format(),
    });
  }

  const { name, email, password } = result.data;

  const user = await registerUser(name, email, password);

  if (!user) {
    return reply.status(409).send({ error: "E-mail already exists" });
  }

  return reply.status(201).send({ message: "User created" });
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const result = loginBodySchema.safeParse(req.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "ValidationError",
      details: result.error.format(),
    });
  }

  const { email, password } = result.data;

  const user = await validateUser(email, password);

  if (!user) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }

  const token = req.server.jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return reply.send({ token });
}
