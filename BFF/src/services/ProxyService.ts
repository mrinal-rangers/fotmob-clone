import { config } from "../config/env";

const CORE_URL = config.core.url;
const API_KEY = config.core.apiKey;

async function coreFetch(path: string, options: RequestInit = {}) {
  const url = `${CORE_URL}/api${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Core API error ${res.status}: ${text}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export const proxy = {
  get: (path: string) => coreFetch(path),
  post: (path: string, body: any) => coreFetch(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path: string, body: any) => coreFetch(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path: string) => coreFetch(path, { method: "DELETE" }),
};
