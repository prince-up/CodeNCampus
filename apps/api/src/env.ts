import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { apiEnvSchema, ApiEnv } from "@codencampus/validators";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Attempt loading from apps/api/.env first, then cwd .env, then relative to dist/src
const candidates = [
  path.resolve(process.cwd(), "apps/api/.env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env"),
];

for (const candidate of candidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
    break;
  }
}
dotenv.config();

function loadEnvironment(): ApiEnv {
  const result = apiEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.errors
      .map(
        (e: { path: (string | number)[]; message: string }) =>
          `  - ${e.path.join(".")}: ${e.message}`,
      )
      .join("\n");
    console.error(
      `\x1b[31m[CRITICAL] Invalid or missing environment variables:\n${errorDetails}\x1b[0m`,
    );
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnvironment();
