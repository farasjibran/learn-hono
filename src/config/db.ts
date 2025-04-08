import { AppDataSource } from "../../ormconfig";

/**
 * Initializes the database connection using TypeORM.
 * Logs a success message if the connection is successful, or
 * logs an error message and exits the process if the connection
 * fails.
 *
 * @author Muhammad Farras Jibran
 */
export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("Connected to PostgreSQL via TypeORM");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

export default AppDataSource;
