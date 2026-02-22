import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

export const securityMiddlewares = [
  helmet(),
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  }),
];