import type { FastifyReply, FastifyRequest } from "fastify";
import { deleteUserSchema } from "../schemas/schema.js";
import { deleteUser } from "../services/admin.services.js";

export async function handleAdminManage(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const result = deleteUserSchema.safeParse(req.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "ValidationError",
      details: result.error.format(),
    });
  }

  const { userId } = result.data;

  const user = await deleteUser(userId);

  return reply.send({
    message: "User deleted successfully",
    user,
  });
}
