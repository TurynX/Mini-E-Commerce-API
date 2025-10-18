import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createCart(userId: number, productIds: number[]) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  const product = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (!product) return null;

  const total = product.reduce((acc, p) => acc + p.price, 0);

  const newCart = await prisma.cartItem.create({
    data: { user: { connect: { id: userId } }, total, productIds },
  });

  return { cart: newCart };
}

export async function getCartFromUser(userId: number) {
  return await prisma.cartItem.findMany({
    where: { userId: userId },
    include: { user: true },
  });
}
