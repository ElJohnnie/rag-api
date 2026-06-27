import dotenv from 'dotenv';

dotenv.config();

const FILE_SIZE_LIMIT_20MB = 20 * 1024 * 1024; 

export const config = {
  embeddings: {
    // Modelo local de embeddings (HuggingFace Transformers). all-MiniLM-L6-v2 → 384 dimensões.
    model: process.env.EMBEDDINGS_MODEL || 'Xenova/all-MiniLM-L6-v2',
    vectorSize: Number(process.env.EMBEDDINGS_VECTOR_SIZE || 384)
  },
  llm: {
    // Geração de resposta via HuggingFace Inference API (free tier). Requer token.
    apiKey: process.env.HUGGING_FACE_API_KEY || '',
    model: process.env.LLM_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3',
    temperature: Number(process.env.LLM_TEMPERATURE || 0.1),
    maxTokens: Number(process.env.LLM_MAX_TOKENS || 512)
  },
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    collectionName: process.env.QDRANT_COLLECTION || 'documents'
  },
  server: {
    port: process.env.PORT || '3000'
  },
  uploadDir: {
    directory: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: FILE_SIZE_LIMIT_20MB
  }
}