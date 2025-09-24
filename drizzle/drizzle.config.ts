import {defineConfig} from "drizzle-kit";


export default defineConfig({
  schema: "./src/models/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",         // ✅ correct dialect for SQLite
  dbCredentials: {
    url: "./sqlite.db",      // ✅ works with "sqlite"
  },
});