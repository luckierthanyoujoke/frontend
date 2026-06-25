type RuntimeConfig = { apiUrl?: string };

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

/** Base URL for the Nest API (no trailing slash). */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const runtime = window.__RUNTIME_CONFIG__?.apiUrl?.trim().replace(/\/$/, "");
    if (runtime && runtime.length > 0) return runtime;
  }

  const raw = (
    process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ?? ""
  ).trim();
  return raw.length > 0 ? raw : "http://localhost:3000";
}
