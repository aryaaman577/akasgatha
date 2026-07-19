/**
 * Mock AI Provider
 * 
 * Development-only provider for Phase 4A backend testing.
 * Returns structured responses without calling external APIs.
 * 
 * CLEARLY MARKED AS MOCK - Never fabricates citations or presents as final AI.
 */

import type { JigyasaProvider, ProviderInput, ProviderOutput, ProviderHealth } from "./types";

const MOCK_DELAY_MS = 800;

export class MockProvider implements JigyasaProvider {
  readonly name = "mock";

  async generate(input: ProviderInput): Promise<ProviderOutput> {
    const startTime = Date.now();

    // Respect abort signal
    if (input.signal.aborted) {
      throw new Error("Request aborted");
    }

    // Simulate realistic delay
    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(resolve, MOCK_DELAY_MS);
      
      input.signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new Error("Request aborted"));
      });
    });

    const answer = this.generateMockAnswer(input);
    const durationMs = Date.now() - startTime;

    return {
      answer,
      meta: {
        durationMs,
      },
    };
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      configured: true,
      available: true,
      mock: true,
    };
  }

  private generateMockAnswer(input: ProviderInput) {
    const languageNote = input.language === "en" 
      ? "" 
      : ` (Response in ${input.language === "hi" ? "Hindi" : "Hinglish"} would be provided by production AI)`;

    // Phase 4B: Include RAG context if available
    const hasRag = input.ragContext && input.ragContext.retrievedChunks.length > 0;
    const ragNote = hasRag 
      ? ` RAG retrieved ${input.ragContext!.totalResults} relevant sources.`
      : "";

    // Extract sources from RAG context
    const sources = hasRag
      ? input.ragContext!.retrievedChunks.map((result) => ({
          id: result.chunk.id,
          title: result.chunk.documentTitle,
          url: result.chunk.sourceUrl || undefined,
        }))
      : [];

    return {
      shortAnswer: `Phase 4B Development Response${languageNote}${ragNote}`,
      
      katha: hasRag && input.ragContext!.metadata.domains.includes("narrative")
        ? `Cultural narratives retrieved from corpus: ${input.ragContext!.retrievedChunks
            .filter(r => r.chunk.domain === "narrative")
            .map(r => r.chunk.documentTitle)
            .join(", ")}. Full narrative synthesis will be provided by production AI.`
        : `The Jigyasa backend connection is working successfully. This is a development response demonstrating RAG integration. Cultural narratives will be synthesized by production AI using retrieved context.`,
      
      vigyan: hasRag && input.ragContext!.metadata.domains.includes("science")
        ? `Scientific explanations retrieved from corpus: ${input.ragContext!.retrievedChunks
            .filter(r => r.chunk.domain === "science")
            .map(r => r.chunk.documentTitle)
            .join(", ")}. Full scientific synthesis will be provided by production AI.`
        : `Scientific explanations require production AI integration. The backend API is ready with RAG retrieval, validation, rate limiting, and structured responses.`,
      
      pramaan: hasRag
        ? [
            `RAG retrieval: ${input.ragContext!.totalResults} sources`,
            `Domains: ${input.ragContext!.metadata.domains.join(", ")}`,
            `Avg relevance: ${(input.ragContext!.metadata.avgScore * 100).toFixed(1)}%`,
            `Retrieval time: ${input.ragContext!.retrievalTime}ms`,
          ]
        : [
            "Phase 4B RAG system ready",
            "Request validation working",
            "Provider abstraction in place",
            "Mock responses clearly labeled",
          ],
      
      uncertainty: hasRag
        ? `This is a Phase 4B development mock response using ${input.ragContext!.totalResults} retrieved sources. Production AI will synthesize coherent answers with proper uncertainty bounds.`
        : `This is a development mock response. Real answers with retrieved sources, evidence boundaries, and uncertainty analysis require production AI integration.`,
      
      sources,
      
      followUps: hasRag
        ? [
            "Can you explain this in more detail?",
            "What are the cultural perspectives on this?",
            "What does modern science say?",
          ]
        : [
            "How will the knowledge corpus be structured?",
            "What retrieval strategy will be used?",
            "How will evidence quality be verified?",
          ],
      
      visual: undefined, // Visual scenes will be added when answer-specific 3D is implemented
    };
  }
}
