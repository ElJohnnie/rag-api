import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import { queryRouter } from "./routes/query.routes.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", queryRouter);

  app.use(errorHandler);

  return app;
}
