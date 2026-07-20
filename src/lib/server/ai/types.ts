/**
 * AI Provider Types and Contracts
 * 
 * Defines the interface for AI provider implementations.
 */

import type { RagContext } from "../rag/types";

export interface ProviderInput {
  question: string;
  language: "en" | "hi" | "hinglish";
  history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  requestId: string;
  signal: AbortSignal;
  ragContext?: RagContext | null; // Phase 4B-4: Optional RAG context
}

export interface ProviderAnswer {
  shortAnswer: string;
  katha: string;
  vigyan: string;
  pramaan: string[];
  uncertainty: string;
  sources: Array<{
    id: string;
    title: string;
    url?: string;
  }>;
  followUps: string[];
  visual?: {
    sceneId: string;
    parameters: Record<string, unknown>;
  };
}

export interface ProviderOutput {
  answer: ProviderAnswer;
  meta: {
    durationMs: number;
    model?: string;
    tokensUsed?: number;
    answerMode?: string; // Phase 5: RAG_GROUNDED, HYBRID, GENERAL_SPACE_KNOWLEDGE, etc.
  };
}

export interface ProviderHealth {
  configured: boolean;
  available: boolean;
  mock: boolean;
}

export interface JigyasaProvider {
  readonly name: string;
  generate(input: ProviderInput): Promise<ProviderOutput>;
  healthCheck?(): Promise<ProviderHealth>;
}
