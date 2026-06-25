type RuntimeConfig = { apiUrl?: string };

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

/** Normalize API base URL: trim, drop trailing slash, add https:// if only a hostname was given. */
function normalizeApiBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (trimmed.length === 0) return "";

  // Same-origin path (e.g. /api) — used behind nginx/EB reverse proxy.
  if (trimmed.startsWith("/")) return trimmed;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // Hostname without scheme (e.g. backend.up.railway.app) — browsers treat that as a relative path.
  return `https://${trimmed}`;
}

/** Base URL for the Nest API (no trailing slash). */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const runtime = window.__RUNTIME_CONFIG__?.apiUrl?.trim();
    if (runtime && runtime.length > 0) return normalizeApiBaseUrl(runtime);
  }

  const raw = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
  const normalized = normalizeApiBaseUrl(raw);
  return normalized.length > 0 ? normalized : "http://localhost:3000";
}
