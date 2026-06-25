import dotenv from 'dotenv';

dotenv.config();

const FILE_SIZE_LIMIT_20MB = 20 * 1024 * 1024; 

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || ''
  },
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    collection: process.env.QDRANT_COLLECTION || 'documents'
  },
  server: {
    port: process.env.PORT || '3000'
  },
  uploadDir: {
    directory: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: FILE_SIZE_LIMIT_20MB
  }
}