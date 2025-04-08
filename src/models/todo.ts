import { z } from "zod";
import AppDataSource from "../config/db";
import { Todo as TodoEntity } from "../entities/todo";

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  completed: z.boolean(),
  userId: z.string().uuid(),
  createdAt: z.date(),
});

export type Todo = z.infer<typeof TodoSchema>;

/**
 * Gets all todos for a given user.
 *
 * @author Muhammad Farras Jibran
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of todos.
 */
export async function getTodosByUser(userId: string): Promise<Todo[]> {
  const todoRepo = AppDataSource.getRepository(TodoEntity);
  const todos = await todoRepo.find({ where: { userId } });
  return todos;
}

/**
 * Gets a single todo by its ID.
 *
 * @author Muhammad Farras Jibran
 * @param id The ID of the todo.
 * @param userId The ID of the user.
 * @returns A promise that resolves to a single todo, or null if not found.
 */
export async function getTodoById(
  id: string,
  userId: string
): Promise<Todo | null> {
  const todoRepo = AppDataSource.getRepository(TodoEntity);
  const todo = await todoRepo.findOneBy({ id, userId });
  return todo || null;
}

/**
 * Creates a new todo for a given user.
 *
 * @author Muhammad Farras Jibran
 * @param title The title of the new todo.
 * @param userId The ID of the user.
 * @returns A promise that resolves to the newly created todo.
 */
export async function createTodo(title: string, userId: string): Promise<Todo> {
  const todoRepo = AppDataSource.getRepository(TodoEntity);
  const todo = todoRepo.create({ title, userId, completed: false }); // Default completed to false
  await todoRepo.save(todo);
  return todo;
}

/**
 * Updates a todo by its ID and the user ID.
 *
 * @author Muhammad Farras Jibran
 * @param id The ID of the todo.
 * @param userId The ID of the user.
 * @param updates A partial object containing the fields to update.
 * @returns A promise that resolves to the updated todo, or null if not found.
 */
export async function updateTodo(
  id: string,
  userId: string,
  updates: Partial<Todo>
): Promise<Todo | null> {
  const todoRepo = AppDataSource.getRepository(TodoEntity);
  const todo = await todoRepo.findOneBy({ id, userId });

  if (!todo) return null;

  todoRepo.merge(todo, updates);
  await todoRepo.save(todo);
  return todo;
}

/**
 * Deletes a single todo by its ID and the user ID.
 *
 * @author Muhammad Farras Jibran
 * @param id The ID of the todo.
 * @param userId The ID of the user.
 * @returns A promise that resolves to a boolean indicating whether the todo was deleted or not.
 */
export async function deleteTodo(id: string, userId: string): Promise<boolean> {
  const todoRepo = AppDataSource.getRepository(TodoEntity);
  const result = await todoRepo.delete({ id, userId });
  return result.affected ? result.affected > 0 : false;
}
