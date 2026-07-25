/**
 * Public re-exports for the services/api layer.
 *
 * ARCHITECTURE CONTRACT:
 *   Components → Hooks → (this layer) → apiClient
 *
 * - Components NEVER import apiClient directly.
 * - Hooks NEVER call fetch/axios directly; they use these services.
 * - apiClient is NOT re-exported here intentionally.
 */

export { studyApi }                    from "./studyApi.js";
export type { GenerateResponse }       from "./studyApi.js";

export { uploadApi }                   from "./uploadApi.js";
export type { ParsedFileResult }       from "./uploadApi.js";
