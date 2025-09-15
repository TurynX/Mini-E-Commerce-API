import type { FastifyInstance } from "fastify";
import z from "zod";
import bcrypt from "bcrypt";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
interface JwtUser {
  id: number;
  email: string;
}

interface Products {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Orders {
  id: number;
  userId: number;
  productIds: number[];
  total: number;
  createdAt: Date;
}

const users: User[] = [];
const products: Products[] = [];
const orders: Orders[] = [];

export async function appRoutes(app: FastifyInstance) {
  app.post("/users/register", async (req, reply) => {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { name, email, password } = registerBodySchema.parse(req.body);

    const emailAlreadyExists = users.find((u) => u.email === email);
    if (emailAlreadyExists) {
      return reply.status(404).send({
        message: "Name or E-mail already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: password_hash,
    };

    users.push(newUser);

    return reply.status(201).send({ message: "User created" });
  });

  app.post("/users/login", async (req, reply) => {
    const registerBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = registerBodySchema.parse(req.body);

    const user = users.find((u) => u.email === email);
    if (!user) {
      return reply.send({ message: "User does not exists" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const token = app.jwt.sign({
      id: user.id,
      email,
      password,
    });

    return reply.status(201).send({
      name: `Welcome ${user.name}`,
      token: `Yours token is : ${token}`,
    });
  });

  app.get("/products", async (req, reply) => {
    return products;
  });

  app.post("/products", async (req, reply) => {
    const addProduct = z.object({
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
    });

    const { name, quantity, price } = addProduct.parse(req.body);

    const newProduct = {
      id: products.length + 1,
      name,
      quantity,
      price,
    };

    products.push(newProduct);
  });

  app.put("/products/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const productId = Number(id);

    const findProduct = products.find((p) => p.id === productId);

    if (!findProduct) {
      return reply.send({ message: "Product does not exists" });
    }

    const productBodySchema = z.object({
      name: z.string(),
      price: z.number(),
    });

    const { name, price } = productBodySchema.parse(req.body);

    if (name !== undefined) {
      findProduct.name = name;
    }
    if (price !== undefined) {
      findProduct.price = price;
    }

    return reply.send(findProduct);
  });

  app.delete("/products/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const productId = Number(id);

    const findProduct = products.findIndex((p) => p.id === productId);

    const deleted = products.splice(findProduct, 1);

    return reply.send({ message: "Deleted successfully" });
  });

  app.post(
    "/orders",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const user = req.user as JwtUser;
      const userId = user.id;

      const orderBodySchema = z.object({
        productIds: z.array(z.number()),
      });

      const { productIds } = orderBodySchema.parse(req.body);

      const invalidProducts = productIds.filter(
        (pId) => !products.find((p) => p.id === pId)
      );
      if (invalidProducts.length > 0) {
        return reply
          .status(400)
          .send({ message: "Some products do not exist", invalidProducts });
      }

      const total = productIds.reduce((acc, pId) => {
        const product = products.find((p) => p.id === pId)!;
        return acc + product.price;
      }, 0);

      const newOrder: Orders = {
        id: orders.length + 1,
        userId: userId,
        productIds,
        total,
        createdAt: new Date(),
      };

      orders.push(newOrder);

      return reply.status(201).send(newOrder);
    }
  );

  app.get(
    "/me/orders",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const user = req.user as JwtUser;
      const userIdNum = user.id;

      const userOrder = orders.filter((o) => o.userId === userIdNum);

      return reply.send(userOrder);
    }
  );

  app.delete(
    "/orders/:id",
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const user = req.user as JwtUser;
      const userId = user.id;

      const { id } = req.params as { id: string };
      const orderId = Number(id);

      const index = orders.findIndex(
        (o) => o.id === orderId && o.userId === userId
      );
      if (index === -1) {
        return reply.status(404).send({ message: "Order not found" });
      }

      const deleted = orders.splice(index, 1);

      return reply.send(deleted[0]);
    }
  );

  app.get("/admin/orders/:userId", async (req, reply) => {
    const { userId } = req.params as { userId: string };
    const userIdNum = Number(userId);

    const findUser = orders.filter((o) => o.userId === userIdNum);

    return reply.send(findUser);
  });
}
