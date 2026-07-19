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

    return {
      shortAnswer: `Phase 4A Development Response${languageNote}`,
      
      katha: `The Jigyasa backend connection is working successfully. This is a Phase 4A development response demonstrating the API structure. Cultural narratives and story-based explanations will be provided by the production AI system with grounded knowledge retrieval in the next phases.`,
      
      vigyan: `Scientific explanations require access to the knowledge corpus and evidence-based retrieval system. The backend API is now ready to accept questions, validate requests, handle rate limiting, and return structured responses. Production AI integration with Gemini or OpenRouter will be added in Phase 4B.`,
      
      pramaan: [
        "Phase 4A backend foundation established",
        "Request validation working",
        "Provider abstraction in place",
        "Mock responses clearly labeled",
      ],
      
      uncertainty: `This is a Phase 4A development mock response. Real answers with retrieved sources, evidence boundaries, and uncertainty analysis will be provided after RAG and production AI integration.`,
      
      sources: [], // Mock provider does not fabricate citations
      
      followUps: [
        "How will the knowledge corpus be structured?",
        "What retrieval strategy will be used?",
        "How will evidence quality be verified?",
      ],
      
      visual: undefined, // Visual scenes will be added when answer-specific 3D is implemented
    };
  }
}
