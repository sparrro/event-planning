import dotenv from "dotenv";
dotenv.config();

export const DB_URI = process.env.mongodb_URI;

export const PORT = process.env.port;

export const BASE_URL = process.env.BASE_URL;