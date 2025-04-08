import { serve } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import "reflect-metadata";
import { connectDB } from "./config/db";
import { authRoutes } from "./routes/auth";
import { todoRoutes } from "./routes/todos";
import { swaggerUI } from "./utils/swagger";

const app = new Hono();

app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.route("/api/auth", authRoutes);
app.route("/api/todos", todoRoutes);
app.get("/docs", swaggerUI);

app.get("/", (c) => c.text("Welcome to Hono CRUD API!"));

/**
 * Initializes the application by connecting to the database and starting the server.
 *
 * This function establishes a connection to the PostgreSQL database using TypeORM.
 * Once the database connection is successful, it starts an HTTP server using Bun
 * on port 3000, serving the Hono application. The function logs a message indicating
 * that the server is running.
 *
 * @author Muhammad Farras Jibran
 * @returns {Promise<void>} A promise that resolves when the server is successfully started.
 */
async function main() {
  await connectDB();

  serve({
    port: 3000,
    fetch: app.fetch,
  });

  console.log("🔥 Server is running at http://localhost:3000");
}

main();
