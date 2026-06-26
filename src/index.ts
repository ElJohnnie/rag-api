import { processDocument } from "./services/document.ts";
import { initQdrantCollection } from "./services/qdrant.ts";

import path from "node:path";

async function main() {
  console.log("Initializing application...");
  try {
    await initQdrantCollection();
    console.log("Qdrant collection initialized successfully.");

    const pdfPath = path.join(process.cwd(), "sample/NIKE10K2023.pdf");
    console.log(`Processing document: ${pdfPath}`);
    const uploadResponse = await processDocument(pdfPath, "sample.pdf");
    console.log("Document processed successfully:", uploadResponse);
  } catch (error) {
    console.error("Error initializing Qdrant collection:", error);
    process.exit(1);
  }
}

main();
