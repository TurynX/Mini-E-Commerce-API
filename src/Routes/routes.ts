import type { FastifyInstance } from "fastify";
import { login, register } from "../controllers/auth.controllers.js";
import { getAllProduct } from "../services/products.service.js";
import {
  handleCreateProducts,
  handleDeleteProducts,
  handleUpdateProducts,
} from "../controllers/products.controller.js";
import {
  handleCreateCart,
  handleGetCartFromUser,
  handleRemoveProductsCart,
} from "../controllers/cart.controller.js";
import { handleAdminManage } from "../controllers/admin.controller.js";
import { handlePayment } from "../controllers/payment.controller.js";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users/register", {
    schema: {
      tags: ["Auth"],
      summary: "Register a new user",
    },
    handler: register,
  });

  app.post("/users/login", {
    schema: {
      tags: ["Auth"],
      summary: "Login with email and password",
    },
    handler: login,
  });

  app.get("/products", {
    schema: {
      tags: ["Products"],
      summary: "Get all products",
    },
    handler: getAllProduct,
  });

  app.post("/products", {
    preHandler: [app.authenticate, app.isAdmin],
    schema: {
      tags: ["Products"],
      summary: "Create a new product",
    },
    handler: handleCreateProducts,
  });

  app.put("/products/:id", {
    preHandler: [app.isAdmin],
    schema: {
      tags: ["Products"],
      summary: "Update a product by ID",
    },
    handler: handleUpdateProducts,
  });

  app.delete("/products/:id", {
    preHandler: [app.isAdmin],
    schema: {
      tags: ["Products"],
      summary: "Delete a product by ID",
    },
    handler: handleDeleteProducts,
  });

  app.post("/cart/add", {
    preHandler: [app.authenticate],
    schema: {
      tags: ["Cart"],
      summary: "Add products to cart",
    },
    handler: handleCreateCart,
  });

  app.delete("/cart/remove/product/:id", {
    preHandler: [app.authenticate],
    schema: {
      tags: ["Cart"],
      summary: "Remove products from a cart",
    },
    handler: handleRemoveProductsCart,
  });

  app.get("/cart", {
    preHandler: [app.authenticate],
    schema: {
      tags: ["Cart"],
      summary: "Get cart for authenticated user",
    },
    handler: handleGetCartFromUser,
  });

  app.delete("/admin", {
    preHandler: [app.authenticate, app.isAdmin],
    schema: {
      tags: ["Admin"],
      summary: "Delete a user (admin only)",
    },
    handler: handleAdminManage,
  });

  app.post("/create-payment", {
    preHandler: [app.authenticate],
    schema: {
      tags: ["Payment"],
      summary: "Payment",
    },
    handler: handlePayment,
  });
}
