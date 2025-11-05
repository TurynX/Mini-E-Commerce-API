import { PrismaClient } from "@prisma/client";
import type { UpdateProductData } from "../Types/product.ts";
const prisma = new PrismaClient();

export async function createProduct(
  name: string,
  quantity: number,
  price: number
) {
  const existingProduct = await prisma.product.findFirst({ where: { name } });

  if (existingProduct) {
    throw new Error("Product with this name already exists");
  }

  return prisma.product.create({ data: { name, quantity, price } });
}

export async function updateProduct(id: number, data: UpdateProductData) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new Error("Product not found");
  }

  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function deleteProduct(id: number) {
  const exists = await prisma.product.findUnique({ where: { id } });

  if (!exists) {
    throw new Error("Product not found");
  }

  return await prisma.product.delete({
    where: { id },
  });
}

export async function getAllProduct() {
  return prisma.product.findMany({});
}
