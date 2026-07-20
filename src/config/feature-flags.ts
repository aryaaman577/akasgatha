/**
 * Feature Flags Configuration
 * 
 * Internal feature toggles for controlling application behavior.
 * These are compile-time constants and not user-configurable.
 */

export interface FeatureFlags {
  /**
   * Phase 6: Dynamic 3D Drishya Yantra Scenes
   * 
   * Controls whether answer-driven 3D scenes (Eclipse, Planet Orbit, etc.)
   * are rendered in Jigyasa responses.
   * 
   * Status: DEFERRED
   * Reason: Current generated visual quality not approved
   * 
   * When disabled:
   * - No 3D Canvas elements rendered
   * - No WebGL dependencies loaded
   * - Fallback to text-only answers
   * - Scene source code preserved for future work
   * 
   * @default false
   */
  drishyaYantraEnabled: boolean;
}

/**
 * Active feature flags
 * 
 * Do not modify these flags based on user input or environment variables.
 * These are internal product decisions.
 */
export const FEATURE_FLAGS: FeatureFlags = {
  drishyaYantraEnabled: false,
} as const;
