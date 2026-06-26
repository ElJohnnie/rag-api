import dotenv from 'dotenv';

dotenv.config();

const FILE_SIZE_LIMIT_20MB = 20 * 1024 * 1024; 

export const config = {
  embeddings: {
    // Modelo local de embeddings (HuggingFace Transformers). all-MiniLM-L6-v2 → 384 dimensões.
    model: process.env.EMBEDDINGS_MODEL || 'Xenova/all-MiniLM-L6-v2',
    vectorSize: Number(process.env.EMBEDDINGS_VECTOR_SIZE || 384)
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