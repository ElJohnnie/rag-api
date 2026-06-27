import { Router } from "express";
import {
  handleQuery,
  handleQueryStream,
} from "../controllers/query.controller.js";

export const queryRouter = Router();

// POST /api/query         -> { question: string, topK?: number }  (resposta JSON)
queryRouter.post("/query", handleQuery);

// POST /api/query/stream  -> { question: string, topK?: number }  (SSE: sources/token/done)
queryRouter.post("/query/stream", handleQueryStream);
