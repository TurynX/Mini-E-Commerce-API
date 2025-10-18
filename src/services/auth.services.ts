import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const exists = await prisma.user.findUnique({ where: { email } });

  if (exists) return null;

  const hashed = await bcrypt.hash(password, 6);

  return prisma.user.create({
    data: { name, email, password: hashed },
  });
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);

  return match ? user : null;
}
