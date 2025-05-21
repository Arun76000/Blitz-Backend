import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { allExceptionsMiddleware } from "./middlewares/All-Exception-filter";
import { interceptorMiddleware } from "./middlewares/interceptor.middleware";
import morgan from "morgan";
import { GlobalMiddleware } from "./middlewares/global.middleware";
import { asyncHandler } from "./utils/asyncHandler";
import { createRateLimitMiddleware } from "./middlewares/guards/rateLimit.guard";

import router from "./routes/index.routes";
import path from "path";

const app: Application = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PATCH", "DELETE"] }));

app.use(
  createRateLimitMiddleware(
    5 * 60 * 1000,
    100,
    "Too many requests. Please try again later."
  )
);
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(interceptorMiddleware);

const globalMiddleware = new GlobalMiddleware().middleware;

app.use(asyncHandler(globalMiddleware));

app.use("/api", router());

app.all("/health", (req, res) => {
  res.status(200).json({ success: true, message: "server health is good." });
});

app.use(allExceptionsMiddleware());

export default app;
