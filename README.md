# learn-hono

A minimal backend project using [Hono](https://hono.dev/) with TypeORM, PostgreSQL, and Zod validation, powered by [Bun](https://bun.sh/).

## ✨ Features

- ⚡ Super fast runtime with **Bun**
- 🧭 Routing with **Hono**
- 📦 Data validation using **Zod**
- 🔐 Authentication with **JWT** and **bcryptjs**
- 🗄️ Database integration using **TypeORM** and **PostgreSQL**
- 📄 Environment variable management with **dotenv**
- 🧪 Type-safe development with TypeScript and relevant type definitions
- 📚 Swagger UI setup included

## 📦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/docs/installation)
- PostgreSQL database

### Installation

```bash
bun install
```

## 📂 Scripts

```bash
# Command                    # Description
bun run dev                  # Run the app in development mode
bun run start                # Run the built app
bun run build                # Build the project to dist/
bun run migration:generate   # Generate a new migration
bun run migration:run        # Run migrations using ormconfig.ts
bun run migration:revert     # Revert the last migration
```

## 🗃 Project Structure

```bash
src/
├── index.ts          # Entry point
├── routes/           # Hono route handlers
├── middleware/       # Middleware like auth
├── validators/       # Zod schemas
├── entities/         # TypeORM entities
└── utils/            # Helper functions
```
