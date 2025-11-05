import fastify from "fastify";
import cors from "@fastify/cors";
import jwtPlugin from "./Plugins/jwt.ts";
import { appRoutes } from "./Routes/routes.ts";
import { PrismaClient } from "@prisma/client";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import yaml from "yaml";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Determine __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load OpenAPI specification
const openapiPath = path.join(__dirname, "../docs/openapi.yaml");
const openapiSpec = yaml.parse(fs.readFileSync(openapiPath, "utf8"));

// Check if running in test environment
const isTest = process.env.NODE_ENV === "test";

if (!isTest && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in production environment.");
}
// Initialize Prisma Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: isTest
        ? "mysql://root:123456@localhost:3306/shop_db_test"
        : process.env.DATABASE_URL!,
    },
  },
});

const app = fastify();
// Register Swagger plugins
app.register(swagger as any, {
  mode: "static",
  specification: {
    document: openapiSpec,
  },
  exposeRoute: true,
});
// Swagger UI setup
app.register(swaggerUI, {
  routePrefix: "/docs",
});

app.decorate("prisma", prisma);
// Register CORS plugin
app.register(cors, {
  origin: true,
});

app.register(jwtPlugin);
app.register(appRoutes);

// Start the server
async function main() {
  try {
    await app.ready();
    await app.listen({ port: 3333 });
    console.log("🚀 Server running at http://localhost:3333");
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}
main();
