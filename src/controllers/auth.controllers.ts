import type { FastifyReply, FastifyRequest } from "fastify";
import { registerBodySchema, loginBodySchema } from "../schemas/schema.js";
import { registerUser, validateUser } from "../services/auth.services.js";

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(req.body);
  const user = await registerUser(name, email, password);

  if (!user) return reply.status(404).send({ error: "E-mail already exists" });
  reply.status(201).send({ message: "User created" });
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginBodySchema.parse(req.body);
  const user = await validateUser(email, password);

  if (!user) return reply.status(401).send({ error: "Invalid credentials" });

  const token = req.server.jwt.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  reply.send({ token });

  console.log(token);
}
