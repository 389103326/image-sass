import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  // dbCredentials: {
  //   // url: "./drizzle/database.sqlite",
  //   url: "postgres:123123@localhost:5432/postgres",
  // },
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "123123",
    database: "postgres",
    ssl: false
  },

  verbose: true,
  strict: true,
});