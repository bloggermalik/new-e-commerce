import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";  // 👈 import all your tables


config({ path: ".env" }); // or .env.local

export const db = drizzle(process.env.DATABASE_URL!, { schema });
