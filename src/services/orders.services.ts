import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createOrder(userId: number, productIds: number[]) {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const invalidProducts = productIds.filter(
    (id) => !products.find((p) => p.id === id)
  );
  if (invalidProducts.length > 0) {
    return { error: true, invalidProducts };
  }

  const total = products.reduce((acc, p) => acc + p.price, 0);

  console.log("Creating order for userId:", userId);

  const newOrder = await prisma.order.create({
    data: { user: { connect: { id: userId } }, total, productIds },
  });

  return { order: newOrder };
}

export async function deleteOrder(userId: number, orderId: number) {
  return await prisma.order.delete({ where: { id: orderId, userId } });
}

export async function getAllOrders() {
  return prisma.order.findMany({});
}
