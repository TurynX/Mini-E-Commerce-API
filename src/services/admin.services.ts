import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function deleteUser(userId: number, reply: any) {
  const exists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!exists)
    return reply.status(404).send({ statusCode: 404, error: "User not found" });

  return await prisma.user.delete({ where: { id: userId } });
}
