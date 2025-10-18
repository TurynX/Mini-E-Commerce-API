import type { FastifyReply, FastifyRequest } from "fastify";
import { orderBodySchema } from "../schemas/schema.js";
import { createOrder, deleteOrder } from "../services/orders.services.js";
import type { JwtUser } from "../Types/jwt.js";

export async function handleCreateOrders(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as JwtUser;
  const userId = user.id;

  console.log("req.user:", req.user);

  const { productIds } = orderBodySchema.parse(req.body);

  const result = await createOrder(userId, productIds);

  if (result.error) {
    return reply.status(400).send({
      message: "Some products do not exist",
      invalidProducts: result.invalidProducts,
    });
  }
  return reply.status(201).send(result.order);
}

export async function handleDeleteOrders(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as JwtUser;
  const userId = user.id;
  const { id } = req.params as { id: string };
  const orderId = Number(id);

  const order = await deleteOrder(userId, orderId);

  if (!order) {
    return reply
      .status(404)
      .send({ message: "Order not found or does not belong to user" });
  }

  return reply.send({ message: "Order deleted successfully", order });
}
