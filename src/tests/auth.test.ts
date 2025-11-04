import { describe, it, expect } from "vitest";
import { loginBodySchema, registerBodySchema } from "../schemas/schema.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Auth Controller", async () => {
  it("should register user", () => {
    const res = {
      name: "Victor",
      email: "victor1@gmail.com",
      password: "123456",
    };

    const result = registerBodySchema.safeParse(res);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      name: "Victor",
      email: "victor1@gmail.com",
      password: "123456",
    });
  });

  it("should fail with missing fields", () => {
    const res = { name: "Victor" };

    const result = registerBodySchema.safeParse(res);

    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThan(0);
  });

  it("should hash password", async () => {
    const password = "123456";
    const hash = await bcrypt.hash(password, 6);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it("should login", async () => {
    const res = {
      email: "victor@gmail.com",
      password: "123456",
    };
    const { email, password } = loginBodySchema.parse(res);
    const user = await prisma.user.findUnique({
      where: { email },
    });
    expect(user).toBeDefined();

    const match = await bcrypt.compare(password, user!.password);

    expect(match).toBe(true);
  });
});
