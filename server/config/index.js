import dotenv from "dotenv";

dotenv.config();

export const IPINFO_TOKEN = process.env.IPINFO_TOKEN;

export const PROD =
  import.meta.env.PROD || process.env.NODE_ENV === "production";

export const PORT = process.env.PORT || 4000;

export const URL_WHITELIST =
  process.env.URL_WHITELIST || "http://localhost:3000,http://localhost:8080";

export const SECRET = process.env.SECRET || "101";

export const CRYPT_KEY = process.env.CRYPT_KEY || "111";
