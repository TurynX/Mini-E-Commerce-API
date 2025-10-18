import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { login, register } from "../controllers/auth.controllers.js";
import { getAllProduct } from "../services/products.service.js";
import {
  handleCreateProducts,
  handleDeleteProducts,
  handleUpdateProducts,
} from "../controllers/products.controller.js";
import {
  handleCreateOrders,
  handleDeleteOrders,
} from "../controllers/orders.controller.js";
import { getAllOrders } from "../services/orders.services.js";
import {
  handleCreateCart,
  handleGetCartFromUser,
} from "../controllers/cart.controller.js";
import { handleAdminManage } from "../controllers/admin.controller.js";

const prisma = new PrismaClient();

export async function appRoutes(app: FastifyInstance) {
  app.post("/users/register", register);

  app.post("/users/login", login);

  app.get("/products", getAllProduct);

  app.post("/products", handleCreateProducts);

  app.put("/products/:id", handleUpdateProducts);

  app.delete("/products/:id", handleDeleteProducts);

  app.post("/orders", {
    preHandler: [app.authenticate],
    handler: handleCreateOrders,
  });

  app.get("/me/orders", {
    preHandler: [app.authenticate],
    handler: getAllOrders,
  });

  app.delete("/orders/:id", {
    preHandler: [app.authenticate],
    handler: handleDeleteOrders,
  });

  app.post("/cart/add", {
    preHandler: [app.authenticate],
    handler: handleCreateCart,
  });

  app.get("/cart", {
    preHandler: [app.authenticate],
    handler: handleGetCartFromUser,
  });

  app.delete("/admin", {
    preHandler: [app.authenticate, app.isAdmin],
    handler: handleAdminManage,
  });
}
