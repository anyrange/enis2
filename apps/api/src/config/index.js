import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(__dirname, "../../../../.env") });

export const IPINFO_TOKEN = process.env.IPINFO_TOKEN;

export const PROD = process.env.NODE_ENV === "production";

export const PORT = process.env.PORT || 4000;

export const URL_WHITELIST =
  process.env.URL_WHITELIST || "http://localhost:3000,http://localhost:8080";

export const SECRET = process.env.SECRET || "101";

export const CRYPT_KEY = process.env.CRYPT_KEY || "111";
