import dotenv from "dotenv"

dotenv.config()

const { IPINFO_TOKEN, PORT = 4000, JWT_SECRET, CRYPT_KEY } = process.env

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing")
}

if (!CRYPT_KEY) {
  throw new Error("CRYPT_KEY is missing")
}

if (!IPINFO_TOKEN) {
  console.warn("IPINFO_TOKEN is missing")
}

const FAKE_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"

export { PORT, JWT_SECRET, CRYPT_KEY, FAKE_USER_AGENT, IPINFO_TOKEN }
