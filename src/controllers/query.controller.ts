import type { Request, Response } from "express";
import { BadRequestError } from "../errors.js";
import { queryRAG } from "../services/rag.js";
import type { QueryRequest } from "../types.js";

// Valida e normaliza o corpo da requisição. Mantém o conhecimento de HTTP/validação
// fora do serviço — o queryRAG recebe sempre um QueryRequest já confiável.
function parseQueryRequest(body: unknown): QueryRequest {
  if (typeof body !== "object" || body === null) {
    throw new BadRequestError("Request body must be a JSON object.");
  }

  const { question, topK } = body as Record<string, unknown>;

  if (typeof question !== "string" || question.trim().length === 0) {
    throw new BadRequestError("Field 'question' is required and must be a non-empty string.");
  }

  if (topK !== undefined) {
    if (typeof topK !== "number" || !Number.isInteger(topK) || topK <= 0) {
      throw new BadRequestError("Field 'topK' must be a positive integer.");
    }
  }

  return { question: question.trim(), ...(topK !== undefined ? { topK } : {}) };
}

export async function handleQuery(req: Request, res: Response): Promise<void> {
  const query = parseQueryRequest(req.body);
  const result = await queryRAG(query);
  res.status(200).json(result);
}
