import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";

export const authMiddleware = jwt({
  secret: process.env.JWT_SECRET || "your-secret-key",
  alg: "HS256",
});

/**
 * Error handler middleware.
 *
 * @author Muhammad Farras Jibran
 * @param {Hono.Context} c - The request context
 * @param {() => Promise<void>} next - The next middleware function
 * @returns {Promise<void>}
 */
export const errorHandler = async (c: any, next: () => Promise<void>) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof HTTPException) {
      return c.json({ error: err.message }, err.status);
    }
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
