# RAG API

> 🌐 **[English](#english)** | **[Português](#português)**

A Retrieval-Augmented Generation (RAG) API: ingests PDF documents, indexes them in a vector
store, and answers questions grounded in the documents — with both a JSON and a streaming (SSE)
endpoint.

**Stack:** Express 5 · TypeScript (ESM / NodeNext) · LangChain · Qdrant (vector store) ·
HuggingFace Inference (LLM) · local embeddings via `@huggingface/transformers`.

---

## English

### Architecture

Clean layering — HTTP concerns stay out of the domain:

```
routes/  →  controllers/  →  services/
(URL)       (HTTP ↔ domain)   (pure RAG logic)
```

- `services/` — pure functions (`queryRAG`, `streamRAG`, `searchDocuments`, `processDocument`).
  `streamRAG` is an async generator that yields domain events; it knows nothing about Express.
- `controllers/` — validate input, call services, serialize the response (JSON or SSE).
- `errors.ts` + `middlewares/error.middleware.ts` — typed errors (`HttpError`) mapped to status codes.
- `config.ts` — `validateConfig()` is called at bootstrap (no throwing at import time).

### Prerequisites

- Node.js 20+
- Docker (for Qdrant)
- A free HuggingFace token: https://huggingface.co/settings/tokens

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file:
   ```env
   HUGGING_FACE_API_KEY=hf_your_token_here
   LLM_MODEL=Qwen/Qwen2.5-7B-Instruct
   QDRANT_URL=http://localhost:6333
   QDRANT_COLLECTION=documents
   EMBEDDINGS_MODEL=Xenova/all-MiniLM-L6-v2
   EMBEDDINGS_VECTOR_SIZE=384
   PORT=3000
   ```
   > The embeddings run locally (no token needed). Only the LLM (answer generation) needs the
   > HuggingFace token. The `LLM_MODEL` must be a model served as chat by the HF router — e.g.
   > `Qwen/Qwen2.5-7B-Instruct` or `meta-llama/Llama-3.1-8B-Instruct`.
3. Start Qdrant:
   ```bash
   docker-compose up -d
   ```
4. Ingest a document (PDF path is set in `src/index.ts`):
   ```bash
   npm run ingest
   ```
   Ingestion is **idempotent** — re-running it for the same file replaces the previous points
   instead of duplicating them.
5. Start the API:
   ```bash
   npm run dev     # watch mode
   # or
   npm run start
   ```

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the API in watch mode |
| `npm run start` | Start the API |
| `npm run ingest` | Ingest the configured PDF into Qdrant |
| `npm run test:stream` | Exercise `streamRAG` from the terminal |
| `npm run lint` / `npm run format` | Lint / format |

### Endpoints

#### `GET /health`
Returns `{ "status": "ok" }`.

#### `POST /api/query`
Body: `{ "question": string, "topK"?: number }` → JSON answer with sources.

```json
{
  "question": "What was Nike total revenue in fiscal 2023?",
  "answer": "O faturamento total da Nike em fiscal 2023 foi de $51,2 bilhões [source: 1].",
  "sources": [
    { "fileName": "sample.pdf", "chunkIndex": 218, "score": 0.79 },
    { "fileName": "sample.pdf", "chunkIndex": 208, "score": 0.76 }
  ]
}
```

#### `POST /api/query/stream`
Same body, streamed as **Server-Sent Events**. Event sequence:
`sources` → many `token` → `done` (or `answer` + `done` when nothing is found).

```
data: {"type":"sources","content":[{"fileName":"sample.pdf","chunkIndex":218,"score":0.79}]}

data: {"type":"token","content":"O"}

data: {"type":"token","content":" fatur"}

data: {"type":"done"}
```

### Validation errors

`400 Bad Request` when `question` is missing/empty or `topK` is not a positive integer:
```json
{ "error": "Field 'question' is required and must be a non-empty string." }
```

### cURL (Postman-ready)

```bash
# Health
curl --location 'http://localhost:3000/health'

# Query (JSON)
curl --location 'http://localhost:3000/api/query' \
--header 'Content-Type: application/json' \
--data '{"question":"What was Nike total revenue in fiscal 2023?","topK":3}'

# Query (streaming / SSE)
curl --location --no-buffer 'http://localhost:3000/api/query/stream' \
--header 'Content-Type: application/json' \
--header 'Accept: text/event-stream' \
--data '{"question":"What was Nike total revenue in fiscal 2023?","topK":3}'
```

> **Postman tip:** import the request, and for the streaming endpoint Postman renders SSE events
> natively (keep `Accept: text/event-stream`). Use `--no-buffer` with curl to see tokens arriving live.

---

## Português

### Arquitetura

Separação de camadas — o HTTP fica fora do domínio:

```
routes/  →  controllers/  →  services/
(URL)       (HTTP ↔ domínio)  (lógica de RAG pura)
```

- `services/` — funções puras (`queryRAG`, `streamRAG`, `searchDocuments`, `processDocument`).
  O `streamRAG` é um async generator que emite eventos de domínio; não conhece o Express.
- `controllers/` — validam a entrada, chamam os serviços e serializam a resposta (JSON ou SSE).
- `errors.ts` + `middlewares/error.middleware.ts` — erros tipados (`HttpError`) mapeados para status.
- `config.ts` — `validateConfig()` é chamado no bootstrap (sem `throw` em tempo de import).

### Pré-requisitos

- Node.js 20+
- Docker (para o Qdrant)
- Um token gratuito da HuggingFace: https://huggingface.co/settings/tokens

### Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env`:
   ```env
   HUGGING_FACE_API_KEY=hf_seu_token_aqui
   LLM_MODEL=Qwen/Qwen2.5-7B-Instruct
   QDRANT_URL=http://localhost:6333
   QDRANT_COLLECTION=documents
   EMBEDDINGS_MODEL=Xenova/all-MiniLM-L6-v2
   EMBEDDINGS_VECTOR_SIZE=384
   PORT=3000
   ```
   > Os embeddings rodam localmente (não precisam de token). Só o LLM (geração da resposta) usa
   > o token da HuggingFace. O `LLM_MODEL` precisa ser um modelo servido como chat pelo router da
   > HF — ex.: `Qwen/Qwen2.5-7B-Instruct` ou `meta-llama/Llama-3.1-8B-Instruct`.
3. Suba o Qdrant:
   ```bash
   docker-compose up -d
   ```
4. Faça a ingestão de um documento (o caminho do PDF está em `src/index.ts`):
   ```bash
   npm run ingest
   ```
   A ingestão é **idempotente** — rodar de novo para o mesmo arquivo substitui os pontos
   anteriores em vez de duplicá-los.
5. Suba a API:
   ```bash
   npm run dev     # modo watch
   # ou
   npm run start
   ```

### Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Sobe a API em modo watch |
| `npm run start` | Sobe a API |
| `npm run ingest` | Ingere o PDF configurado no Qdrant |
| `npm run test:stream` | Exercita o `streamRAG` pelo terminal |
| `npm run lint` / `npm run format` | Lint / formatação |

### Endpoints

#### `GET /health`
Retorna `{ "status": "ok" }`.

#### `POST /api/query`
Body: `{ "question": string, "topK"?: number }` → resposta JSON com as fontes.

```json
{
  "question": "What was Nike total revenue in fiscal 2023?",
  "answer": "O faturamento total da Nike em fiscal 2023 foi de $51,2 bilhões [source: 1].",
  "sources": [
    { "fileName": "sample.pdf", "chunkIndex": 218, "score": 0.79 },
    { "fileName": "sample.pdf", "chunkIndex": 208, "score": 0.76 }
  ]
}
```

#### `POST /api/query/stream`
Mesmo body, transmitido como **Server-Sent Events**. Sequência de eventos:
`sources` → vários `token` → `done` (ou `answer` + `done` quando nada é encontrado).

```
data: {"type":"sources","content":[{"fileName":"sample.pdf","chunkIndex":218,"score":0.79}]}

data: {"type":"token","content":"O"}

data: {"type":"token","content":" fatur"}

data: {"type":"done"}
```

### Erros de validação

`400 Bad Request` quando `question` está ausente/vazio ou `topK` não é um inteiro positivo:
```json
{ "error": "Field 'question' is required and must be a non-empty string." }
```

### cURL (pronto para o Postman)

```bash
# Health
curl --location 'http://localhost:3000/health'

# Pergunta (JSON)
curl --location 'http://localhost:3000/api/query' \
--header 'Content-Type: application/json' \
--data '{"question":"What was Nike total revenue in fiscal 2023?","topK":3}'

# Pergunta (streaming / SSE)
curl --location --no-buffer 'http://localhost:3000/api/query/stream' \
--header 'Content-Type: application/json' \
--header 'Accept: text/event-stream' \
--data '{"question":"What was Nike total revenue in fiscal 2023?","topK":3}'
```

> **Dica Postman:** importe a requisição; no endpoint de streaming o Postman renderiza os eventos
> SSE nativamente (mantenha `Accept: text/event-stream`). Com curl, use `--no-buffer` para ver os
> tokens chegando em tempo real.
