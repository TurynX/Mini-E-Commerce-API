import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import dotenv from "dotenv";
import type { FastifyReply } from "fastify";

dotenv.config();

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export async function payment(userId: number, reply: FastifyReply) {
  const user = await prisma.cartItem.findFirst({
    where: { userId },
  });

  if (!user) {
    return reply.send({ error: "Cart does not found" });
  }
  const amount = Math.round(user.total * 100);
  if (amount <= 50) {
    return reply.status(400).send({ error: "Value much low" });
  }
  console.log(amount);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { userId: userId.toString() },
    });
    return reply.send({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    reply.status(500).send({ error: err.message });
  }
}
