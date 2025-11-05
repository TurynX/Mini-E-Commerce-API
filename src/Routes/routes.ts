import type { FastifyInstance } from "fastify";
import { login, register } from "../controllers/auth.controllers.ts";
import { getAllProduct } from "../services/products.service.ts";
import {
  handleCreateProducts,
  handleDeleteProducts,
  handleUpdateProducts,
} from "../controllers/products.controller.ts";
import {
  handleCreateCart,
  handleGetCartFromUser,
  handleRemoveProductsCart,
} from "../controllers/cart.controller.ts";
import { handleAdminManage } from "../controllers/admin.controller.ts";
import { handlePayment } from "../controllers/payment.controller.ts";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users/register", {
    handler: register,
  });

  app.post("/users/login", {
    handler: login,
  });

  app.get("/products", {
    handler: getAllProduct,
  });

  app.post("/products", {
    preHandler: [app.authenticate, app.isAdmin],

    handler: handleCreateProducts,
  });

  app.put("/products/:id", {
    preHandler: [app.authenticate, app.isAdmin],

    handler: handleUpdateProducts,
  });

  app.delete("/products/:id", {
    preHandler: [app.authenticate, app.isAdmin],

    handler: handleDeleteProducts,
  });

  app.post("/cart/add", {
    preHandler: [app.authenticate],

    handler: handleCreateCart,
  });

  app.delete("/cart/remove/product/:id", {
    preHandler: [app.authenticate],

    handler: handleRemoveProductsCart,
  });

  app.get("/cart", {
    preHandler: [app.authenticate],

    handler: handleGetCartFromUser,
  });

  app.delete("/admin", {
    preHandler: [app.authenticate, app.isAdmin],

    handler: handleAdminManage,
  });

  app.post("/create-payment", {
    preHandler: [app.authenticate],

    handler: handlePayment,
  });
}
