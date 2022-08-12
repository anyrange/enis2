import crypto from "crypto";
import { CRYPT_KEY } from "../config/index.js";

const algorithm = "aes-256-ctr";
const iv = crypto.randomBytes(16);

export const encrypt = (text) => {
  if (!text) return null;
  const cipher = crypto.createCipheriv(algorithm, CRYPT_KEY, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

export const decrypt = (hash) => {
  if (!hash) return null;

  const decipher = crypto.createDecipheriv(
    algorithm,
    CRYPT_KEY,
    Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
