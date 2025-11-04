import { PrismaClient } from "@prisma/client";
import { updateProduct } from "./products.service.js";
import { createSecureContext } from "tls";
const prisma = new PrismaClient();

export async function createCart(userId: number, productIds: number[]) {
  const product = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (!product) return null;

  const existingCartItems = await prisma.cartItem.findFirst({
    where: { userId },
  });

  const newProductIds = productIds as Number[];

  if (existingCartItems) {
    const currentProducts = existingCartItems.productIds as number[];

    const updatedProductIds = Array.from(
      new Set([...currentProducts, ...newProductIds])
    ).map(Number);

    const updatedProducts = await prisma.product.findMany({
      where: { id: { in: updatedProductIds } },
    });

    const newTotal = updatedProducts.reduce((sum, p) => sum + p.price, 0);

    return await prisma.cartItem.update({
      where: { id: existingCartItems.id },
      data: { productIds: updatedProductIds, total: newTotal },
    });
  }

  const total = product.reduce((sum, p) => sum + p.price, 0);

  return await prisma.cartItem.create({
    data: {
      userId,
      productIds,
      total,
    },
  });
}
export async function removeFromCart(userId: number, productIds: number[]) {
  const cart = await prisma.cartItem.findFirst({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart does not exists");
  }

  const currentProductsCart = cart!.productIds as number[];
  const productIdsCart = currentProductsCart.map(Number);

  const exist = productIds.every((id) => productIdsCart.includes(id));

  if (exist === false) {
    throw new Error("Some products does not exists in the Cart");
  }

  const currentProducts = cart!.productIds as number[];
  const remainingProducts = currentProducts.filter(
    (id) => !productIds.includes(id)
  );

  const product = await prisma.product.findMany({
    where: { id: { in: remainingProducts } },
  });

  const newTotal = product.reduce((sum, product) => sum + product.price, 0);

  return {
    updatedCart: await prisma.cartItem.update({
      where: { id: cart.id },
      data: {
        productIds: remainingProducts,
        total: newTotal,
      },
    }),

    message: `${remainingProducts.length} removed`,
  };
}

export async function getCartFromUser(userId: number) {
  return await prisma.cartItem.findFirst({
    where: { userId },
  });
}
