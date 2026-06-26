import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers"; 
import { config } from "../config.js";

// Embeddings locais, executados na própria máquina via @huggingface/transformers.
// Não requer chave de API. O modelo padrão (all-MiniLM-L6-v2) gera vetores de 384 dimensões.
export const embeddings = new HuggingFaceTransformersEmbeddings({
  model: config.embeddings.model,
});
