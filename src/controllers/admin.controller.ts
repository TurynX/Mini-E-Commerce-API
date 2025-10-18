import type { FastifyReply, FastifyRequest } from "fastify";
import { deleteUserSchema } from "../schemas/schema.js";
import { deleteUser } from "../services/admin.services.js";

export async function handleAdminManage(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = deleteUserSchema.parse(req.body);

  const user = await deleteUser(userId);

  return user;
}
