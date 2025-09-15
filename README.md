# Mini E-Commerce API

A simple **Fastify + TypeScript** backend for a mini e-commerce system.  
All functionality is implemented in a single `appRoutes.ts` file using in-memory arrays.

---

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication for protected routes
- CRUD operations for products
- Create, list, and cancel orders
- TypeScript type-safe code
- Simple, single-file structure

---

API Endpoints
Users

- POST /users/register - Register a new user
  Body: { name, email, password }

- POST /users/login - Login user and get JWT token
  Body: { email, password }

Products

- GET /products - List all products

- POST /products - Add a new product (protected)
  Body: { name, quantity, price }

- PUT /products/:id - Update a product (protected)
  Body: { name?, price? }

- DELETE /products/:id - Delete a product (protected)

Orders

- POST /orders - Create a new order (protected)
  Body: { userId, productIds, total }

- GET /orders/:userId - Get all orders for a user (protected)

- DELETE /orders/:id - Cancel an order (protected)

Notes

This project uses in-memory arrays. Data will be lost when the server restarts.

Set JWT_SECRET in environment variables for secure tokens.

Passwords are hashed using bcrypt.
