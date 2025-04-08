import { z } from "zod";
import AppDataSource from "../config/db";
import { User as UserEntitiy } from "../entities/user";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().min(8),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Finds a user by their email.
 *
 * @author Muhammad Farras Jibran
 * @param email The email of the user to search for.
 * @returns A promise that resolves to the user if found, or null if not found.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const userRepo = AppDataSource.getRepository(UserEntitiy);
  const user = await userRepo.findOneBy({ email });
  return user || null;
}

/**
 * Creates a new user with the given email and password.
 *
 * @author Muhammad Farras Jibran
 * @param email The email of the user to create.
 * @param password The password of the user to create.
 * @returns A promise that resolves to the created user.
 */
export async function createUser(
  email: string,
  password: string
): Promise<User> {
  const userRepo = AppDataSource.getRepository(UserEntitiy);
  const user = userRepo.create({ email, password });
  await userRepo.save(user);
  return user;
}
