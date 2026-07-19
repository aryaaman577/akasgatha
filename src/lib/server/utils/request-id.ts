/**
 * Request ID Generation
 * 
 * Generates unique request IDs for API calls and logging.
 * Uses crypto.randomUUID() which is available in Node.js 16+
 */

import { randomUUID } from "crypto";

export function generateRequestId(): string {
  return randomUUID();
}
