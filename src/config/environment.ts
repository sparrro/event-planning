import dotenv from "dotenv";

dotenv.config();

export const DB_URI = process.env.MONGODB_URI;

export const PORT = Number(process.env.PORT);

export const BASE_URL = process.env.BASE_URL;

export const SALTROUNDS = Number(process.env.SALTROUNDS);

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

export const MAILJET_API_KEY = process.env.MAILJET_API_KEY;

export const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;

export const EMAIL = process.env.EMAIL;