import { QdrantClient } from "@qdrant/js-client-rest";
import { config } from "../config.js";

export const qdrantClient = new QdrantClient({
	url: config.qdrant.url,
});

export async function initQdrantCollection() {
	const collections = await qdrantClient.getCollections();

	const exists = collections.collections.some(
		(col) => col.name === config.qdrant.collectionName,
	);

	if (!exists) {
		await qdrantClient.createCollection(config.qdrant.collectionName, {
			vectors: {
				size: config.embeddings.vectorSize, // Dimensão do modelo local de embeddings (all-MiniLM-L6-v2 → 384)
				distance: "Cosine", // Métrica padrão de similaridade para embeddings de texto
			},
		});

		console.log(`✔︎ Collection '${config.qdrant.collectionName}' created.`);
	} else {
		console.log(
			`✔︎ Collection '${config.qdrant.collectionName}' already exists.`,
		);
	}

	// Índice de payload em fileName: necessário para filtrar/deletar pontos por
	// arquivo (ingestão idempotente). createPayloadIndex é idempotente no Qdrant.
	await qdrantClient.createPayloadIndex(config.qdrant.collectionName, {
		field_name: "fileName",
		field_schema: "keyword",
	});
}

// Remove todos os pontos de um arquivo. Usado antes de re-ingerir o mesmo
// documento para que a ingestão substitua em vez de duplicar.
export async function deleteDocumentByFileName(fileName: string) {
	await qdrantClient.delete(config.qdrant.collectionName, {
		wait: true,
		filter: {
			must: [{ key: "fileName", match: { value: fileName } }],
		},
	});
}
