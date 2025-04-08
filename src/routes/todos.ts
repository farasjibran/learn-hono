import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import AppDataSource from "../config/db";
import { Todo, TodoSchema } from "../entities/todo";
import { authMiddleware } from "../middleware/auth";

export const todoRoutes = new Hono();

const CreateTodoSchema = TodoSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

todoRoutes.use("*", authMiddleware);

todoRoutes.get("/", async (c) => {
  const user = c.get("jwtPayload");
  const todoRepo = AppDataSource.getRepository(Todo);
  const todos = await todoRepo.find({ where: { userId: user.id } });
  return c.json(todos);
});

todoRoutes.post("/", zValidator("json", CreateTodoSchema), async (c) => {
  const user = c.get("jwtPayload");
  const { title, completed } = c.req.valid("json");

  const todoRepo = AppDataSource.getRepository(Todo);
  const todo = todoRepo.create({
    title,
    completed: completed ?? false,
    userId: user.id,
  });
  await todoRepo.save(todo);

  return c.json(todo, 201);
});

todoRoutes.get("/:id", async (c) => {
  const user = c.get("jwtPayload");
  const todoRepo = AppDataSource.getRepository(Todo);
  const todo = await todoRepo.findOneBy({
    id: c.req.param("id"),
    userId: user.id,
  });
  if (!todo) return c.json({ error: "Todo not found" }, 404);
  return c.json(todo);
});

todoRoutes.put("/:id", zValidator("json", CreateTodoSchema), async (c) => {
  const user = c.get("jwtPayload");
  const todoRepo = AppDataSource.getRepository(Todo);
  const todo = await todoRepo.findOneBy({
    id: c.req.param("id"),
    userId: user.id,
  });

  if (!todo) return c.json({ error: "Todo not found" }, 404);

  todoRepo.merge(todo, c.req.valid("json"));
  await todoRepo.save(todo);
  return c.json(todo);
});

todoRoutes.delete("/:id", async (c) => {
  const user = c.get("jwtPayload");
  const todoRepo = AppDataSource.getRepository(Todo);
  const result = await todoRepo.delete({
    id: c.req.param("id"),
    userId: user.id,
  });

  if (result.affected === 0) return c.json({ error: "Todo not found" }, 404);
  return c.json({ message: "Todo deleted" });
});
