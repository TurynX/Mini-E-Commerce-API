import type { FastifyReply, FastifyRequest } from "fastify";
import { payment } from "../services/payment.services.ts";
import type { JwtUser } from "../Types/jwt.ts";

export async function handlePayment(req: FastifyRequest, reply: FastifyReply) {
  const id = req.user as JwtUser;
  const userId = id.id;

  const result = await payment(userId, reply);

  if (!result) {
    return reply.status(404).send({ message: "Payment not found" });
  }

  return result;
}
