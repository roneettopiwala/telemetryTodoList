
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Create Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db", // Fallback for local dev
  authToken: process.env.TURSO_TOKEN,
});

export const db = drizzle(client, { schema });