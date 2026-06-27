import { createApp } from "./app.js";
import { config } from "./config.js";
import { initQdrantCollection } from "./services/qdrant.js";

async function bootstrap() {
  await initQdrantCollection();

  const app = createApp();
  const port = Number(config.server.port);

  app.listen(port, () => {
    console.log(`🚀 API running on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
