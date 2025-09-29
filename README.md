Mini E-Commerce API
A simple Fastify + TypeScript backend for a mini e-commerce system.
Originally built with in-memory arrays, now upgraded to use a MySQL database with Prisma ORM for persistent storage and relational modeling.

🚀 Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication for protected routes
- CRUD operations for products
- Create, list, and cancel orders
- Type-safe code with TypeScript
- Prisma ORM with MySQL support
- Persistent data storage
- Simple, single-file route structure

🛠️ Setup Instructions

1. Clone the repository
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name

2. Install dependencies
   npm install

3. Configure environment variables
   Create a .env file in the root directory:
   DATABASE_URL="mysql://username:password@localhost:3306/shop_db"
   JWT_SECRET="your_jwt_secret"

4. Apply Prisma migrations
   npx prisma migrate dev

5. Start the development server
   npm run dev

📦 API Endpoints
👤 Users

- POST /users/register – Register a new user
  Body: { name, email, password }
- POST /users/login – Login and receive JWT
  Body: { email, password }
  🛍️ Products
- GET /products – List all products
- POST /products – Add a new product (protected)
  Body: { name, quantity, price }
- PUT /products/:id – Update a product (protected)
  Body: { name?, price? }
- DELETE /products/:id – Delete a product (protected)
  🧾 Orders
- POST /orders – Create a new order (protected)
  Body: { userId, productIds, total }
- GET /orders/:userId – Get all orders for a user (protected)
- DELETE /orders/:id – Cancel an order (protected)

📝 Notes

- Prisma handles all database interactions with MySQL.
- Passwords are securely hashed using bcrypt.
- JWT is used for authentication — set JWT_SECRET in .env.
- Data is now stored persistently in the shop_db MySQL database.
