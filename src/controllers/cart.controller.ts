import type { FastifyReply, FastifyRequest } from "fastify";
import { createCartSchema } from "../schemas/schema.js";
import { createCart, getCartFromUser } from "../services/cart.services.js";
import type { JwtUser } from "../Types/jwt.js";

export async function handleCreateCart(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as JwtUser;
  const userId = user.id;

  const { productIds } = createCartSchema.parse(req.body);

  const cart = await createCart(userId, productIds);

  if (!cart) return reply.status(404).send({ message: "Error in the Cart" });

  return cart;
}

export async function handleGetCartFromUser(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as JwtUser;
  const userId = user.id;

  const cart = await getCartFromUser(userId);

  return cart;
}
