import type { FastifyReply, FastifyRequest } from "fastify";
import {
  addProductBodySchema,
  updateProductBodySchema,
} from "../schemas/schema.js";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../services/products.service.js";
import type { UpdateProductData } from "../Types/product.js";

export async function handleCreateProducts(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { name, quantity, price } = addProductBodySchema.parse(req.body);

  const product = await createProduct(name, quantity, price);

  return reply.status(201).send(product);
}

export async function handleUpdateProducts(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };
  const productId = Number(id);

  const { name, quantity, price } = updateProductBodySchema.parse(req.body);

  if (name === undefined && quantity === undefined && price === undefined) {
    return reply
      .status(400)
      .send({ message: "Send at least one field to update" });
  }
  const data: UpdateProductData = {};
  if (name !== undefined) data.name = name;
  if (quantity !== undefined) data.quantity = quantity;
  if (price !== undefined) data.price = price;

  const updatedProduct = await updateProduct(productId, data);

  if (!updatedProduct) {
    return reply.status(404).send({ message: "Product does not exist" });
  }

  return reply.send(updatedProduct);
}

export async function handleDeleteProducts(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };
  const productId = Number(id);
  const product = await deleteProduct(productId);
}
