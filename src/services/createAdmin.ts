import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  const password = "123456";
  const hashed = await bcrypt.hash(password, 6);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@exemplo.com",
      password: hashed,
      role: "admin",
    },
  });
  console.log("Admin created succefully!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
