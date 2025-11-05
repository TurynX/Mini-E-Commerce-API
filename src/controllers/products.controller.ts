import type { FastifyReply, FastifyRequest } from "fastify";
import {
  addProductBodySchema,
  updateProductBodySchema,
} from "../schemas/schema.ts";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/products.service.ts";
import type { UpdateProductData } from "../Types/product.ts";

export async function handleCreateProducts(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const result = addProductBodySchema.safeParse(req.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "ValidationError",
      details: result.error.format(),
    });
  }

  const { name, quantity, price } = result.data;

  const product = await createProduct(name, quantity, price);

  return reply.status(201).send({
    message: "Product created successfully",
    product,
  });
}

export async function handleUpdateProducts(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };
  const productId = Number(id);

  const result = updateProductBodySchema.safeParse(req.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "ValidationError",
      details: result.error.format(),
    });
  }

  const { name, quantity, price } = result.data;

  if (name === undefined && quantity === undefined && price === undefined) {
    return reply.status(400).send({
      message: "Send at least one field to update",
    });
  }

  const data: UpdateProductData = {};
  if (name !== undefined) data.name = name;
  if (quantity !== undefined) data.quantity = quantity;
  if (price !== undefined) data.price = price;

  const updatedProduct = await updateProduct(productId, data);

  if (!updatedProduct) {
    return reply.status(404).send({
      message: "Product does not exist",
    });
  }

  return reply.send({
    message: "Product updated successfully",
    updatedProduct,
  });
}

export async function handleDeleteProducts(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };
  const productId = Number(id);

  const product = await deleteProduct(productId);

  if (!product) {
    return reply.status(404).send({
      message: "Product does not exist",
    });
  }

  return reply.send({ message: "Product deleted successfully", product });
}
