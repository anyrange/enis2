import dotenv from "dotenv";
dotenv.config();

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTION",
};

export const SECRET = process.env.SECRET || "secret";
