import { PrismaClient } from "@prisma/client";
import type { UpdateProductData } from "../Types/product.js";
const prisma = new PrismaClient();

export async function createProduct(
  name: string,
  quantity: number,
  price: number
) {
  return prisma.product.create({ data: { name, quantity, price } });
}

export async function updateProduct(id: number, data: UpdateProductData) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) return null;

  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: number) {
  const exists = await prisma.product.findUnique({ where: { id } });

  if (!exists) {
    return null;
  }

  await prisma.product.delete({
    where: { id },
  });
}

export async function getAllProduct() {
  return prisma.product.findMany({});
}
