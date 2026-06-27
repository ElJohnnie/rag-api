import type { Response } from "express";
import { initQdrantCollection } from "./services/qdrant.js";
import { streamRAG } from "./services/rag.ts";

// Response falso para testar o streamRAG pelo terminal: imprime cada
// evento SSE (sources/token/answer/done) conforme é escrito.
function createMockResponse(): Response {
  return {
    write(chunk: string) {
      const payload = chunk.replace(/^data: /, "").trim();
      if (!payload) return true;
      try {
        const event = JSON.parse(payload);
        if (event.type === "token") {
          process.stdout.write(event.content);
        } else {
          console.log(`\n[${event.type}]`, event.content ?? "");
        }
      } catch {
        process.stdout.write(chunk);
      }
      return true;
    },
    end() {
      console.log("\n--- stream finalizado ---");
      return this;
    },
  } as unknown as Response;
}

async function main() {
  console.log("Testando streamRAG...");
  try {
    await initQdrantCollection();

    const sampleQuestion = "What was Nike's net revenue in 2022?";
    const res = createMockResponse();
    await streamRAG({ question: sampleQuestion, topK: 3 }, res);
  } catch (error) {
    console.error("Error running streamRAG:", error);
    process.exit(1);
  }
}

main();
