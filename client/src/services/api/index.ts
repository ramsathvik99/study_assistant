/**
 * Public API surface for the services/api layer.
 *
 * ARCHITECTURE RULE:
 * - Only service modules (authApi, studyApi, uploadApi) are exported here.
 * - `apiClient` (the raw Axios instance) is intentionally NOT exported.
 *   Components must NEVER import apiClient. Only hooks and services may use it.
 * - Hooks import from here or from individual service files.
 * - Components import from hooks only.
 */

// authApi is not implemented — stale export removed
export { studyApi } from "./studyApi.js";

export { uploadApi } from "./uploadApi.js";
export type { ParsedFileResult } from "./uploadApi.js";
