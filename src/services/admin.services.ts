import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function deleteUser(userId: number) {
  const exists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!exists) return null;

  return await prisma.user.delete({ where: { id: userId } });
}
