import type { FastifyReply, FastifyRequest } from "fastify";
import { createCartSchema } from "../schemas/schema.ts";
import {
  createCart,
  getCartFromUser,
  removeFromCart,
} from "../services/cart.services.ts";
import type { JwtUser } from "../Types/jwt.ts";

export async function handleCreateCart(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as JwtUser;
  const userId = user.id;

  const result = createCartSchema.parse(req.body);

  if (!result) {
    return reply.status(400).send({ message: "Invalid request body" });
  }

  const productIds = result.productIds;

  const cart = await createCart(userId, productIds);

  if (!cart) {
    return reply.status(500).send({ message: "Something went wrong" });
  }

  return reply.send({ message: "Cart created successfully", cart });
}
export async function handleRemoveProductsCart(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as JwtUser;
  const userId = user.id;
  const { id } = req.params as { id: string };

  const productIds = id.split(",").map(Number);

  const remove = await removeFromCart(userId, productIds);

  if (!remove) {
    reply.status(500).send({ message: "Something went wrong" });
  }
  return reply.send({
    message: "Products removed successfully from cart",
    remove,
  });
}

export async function handleGetCartFromUser(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as JwtUser;
  const userId = user.id;

  const cart = await getCartFromUser(userId);

  return reply.send({
    message: "Cart fetched successfully",
    cart,
  });
}
