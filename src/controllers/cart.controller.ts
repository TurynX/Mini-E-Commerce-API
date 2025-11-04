import type { FastifyReply, FastifyRequest } from "fastify";
import { createCartSchema } from "../schemas/schema.js";
import {
  createCart,
  getCartFromUser,
  removeFromCart,
} from "../services/cart.services.js";
import type { JwtUser } from "../Types/jwt.js";

export async function handleCreateCart(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as JwtUser;
  const userId = user.id;

  const result = createCartSchema.parse(req.body);

  if (!result) {
    return reply.status(400).send({
      error: "ValidationError",
    });
  }

  const productIds = result.productIds;

  const cart = await createCart(userId, productIds);

  if (!cart) {
    return reply.status(500).send({ message: "Error creating cart" });
  }

  return reply.send({
    message: "Cart created successfully",
    cart,
  });
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
    throw new Error("Something wrong");
  }

  return;
}

export async function handleGetCartFromUser(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as JwtUser;
  const userId = user.id;

  const cart = await getCartFromUser(userId);

  return reply.send({
    message: "Cart retrieved successfully",
    cart,
  });
}
