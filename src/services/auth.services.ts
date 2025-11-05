import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function registerUser(
  name: string,
  email: string,
  password: string,
  reply: any
) {
  const exists = await prisma.user.findUnique({ where: { email } });

  if (exists) return reply.status(409).send({ error: "E-mail already exists" });

  const hashed = await bcrypt.hash(password, 6);

  return prisma.user.create({
    data: { name, email, password: hashed },
  });
}

export async function validateUser(
  email: string,
  password: string,
  reply: any
) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return reply.status(401).send({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);

  return match
    ? user
    : reply.status(401).send({ error: "Invalid credentials" });
}
