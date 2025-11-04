import type { FastifyReply, FastifyRequest } from "fastify";
import { payment } from "../services/payment.services.js";
import type { JwtUser } from "../Types/jwt.js";

export async function handlePayment(req: FastifyRequest, reply: FastifyReply) {
  const id = req.user as JwtUser;
  const userId = id.id;

  const result = await payment(userId, reply);

  if (!result) {
    return reply.send({ error: "Something wrong" });
  }

  return result;
}
