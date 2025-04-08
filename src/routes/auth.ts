import { zValidator } from "@hono/zod-validator";
import { compare, hash } from "bcryptjs";
import { Hono } from "hono";
import { sign } from "jsonwebtoken";
import AppDataSource from "../config/db";
import { User, UserSchema } from "../entities/user";
import { authMiddleware } from "../middleware/auth";

export const authRoutes = new Hono();

const loginSchema = UserSchema.pick({ email: true, password: true });
const registerSchema = UserSchema.omit({ id: true, createdAt: true });

authRoutes.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOneBy({ email });
  if (existingUser) {
    return c.json({ error: "User already exists" }, 400);
  }

  const hashedPassword = await hash(password, 10);
  const user = userRepo.create({ email, password: hashedPassword });
  await userRepo.save(user);

  return c.json({ message: "User registered successfully" }, 201);
});

authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email });

  if (!user || !(await compare(password, user.password))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = sign(
    { id: user.id, email },
    process.env.JWT_SECRET || "your-secret-key",
    {
      expiresIn: "1h",
    }
  );

  return c.json({ token });
});

authRoutes.get("/me", authMiddleware, (c) => {
  const user = c.get("jwtPayload");
  return c.json(user);
});
