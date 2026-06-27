export interface QueryRequest {
  question: string;
  topK?: number;
}

export interface ChunkMetadata {
  documentId: string;
  fileName: string;
  chunkIndex: number;
  page: number;
}

export interface SearchResponse {
  id: string;
  text: string;
  score: number;
  metadata: {
    documentId: string;
    fileName: string;
    chunkIndex: number;
    page?: number;
  };
}

export interface QueryResponse {
  question: string;
  results: SearchResponse[];
  retrievedChunks: number;
}

export interface SourceReference {
  fileName: string;
  chunkIndex: number;
  score: number;
}

export interface RAGResponse {
  question: string;
  answer: string;
  sources: SourceReference[];
}

// Eventos emitidos pelo streaming de RAG. Pertencem ao domínio — a camada HTTP
// (controller) é quem os serializa como SSE.
export type RagStreamEvent =
  | { type: "sources"; content: SourceReference[] }
  | { type: "token"; content: string }
  | { type: "answer"; content: string }
  | { type: "done" };
