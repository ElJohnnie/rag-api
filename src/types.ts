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
  metadata: ChunkMetadata;
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
