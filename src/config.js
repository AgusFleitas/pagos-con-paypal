import { config } from "dotenv";
config();

export const PORT = 3000;
export const HOST = "http://localhost:" + PORT;

export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
export const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
export const PAYPAL_API = "https://api-m.sandbox.paypal.com";
