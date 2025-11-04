import { z } from "zod";

export const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const addProductBodySchema = z.object({
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const updateProductBodySchema = z.object({
  name: z.string().optional(),
  quantity: z.number().optional(),
  price: z.number().optional(),
});

export const orderBodySchema = z.object({
  productIds: z.array(z.number()),
});

export const createCartSchema = z.object({
  productIds: z.array(z.number()),
});

export const deleteUserSchema = z.object({
  userId: z.number(),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type AddProductBody = z.infer<typeof addProductBodySchema>;
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
export type OrderBody = z.infer<typeof orderBodySchema>;
export type CreateCartBody = z.infer<typeof createCartSchema>;
export type DeleteUserBody = z.infer<typeof deleteUserSchema>;
