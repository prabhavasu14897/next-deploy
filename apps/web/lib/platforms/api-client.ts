const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface ApiError {
  code: string;
  message: string;
}

export interface CredentialFieldPayload {
  key: string;
  label: string;
  secret: boolean;
  value: string;
}

export interface CredentialFieldResponse {
  key: string;
  label: string;
  secret: boolean;
  value: string | null;
  hasValue: boolean;
}

export interface PlatformPayload {
  name: string;
  summary: string;
  accountNoun: string;
  accountNounPlural: string;
  apiBaseUrl: string;
  credentialFields: CredentialFieldPayload[];
}

export interface PlatformResponse {
  id: string;
  name: string;
  summary: string;
  accountNoun: string;
  accountNounPlural: string;
  apiBaseUrl: string;
  credentialFields: CredentialFieldResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveredAccount {
  externalId: string;
  name: string;
  handle: string;
  type: string;
  followers: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "content-type": "application/json" },
      ...init,
    });
  } catch {
    throw { code: "unknown", message: `Couldn't reach the API at ${API_URL}.` } satisfies ApiError;
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw {
      code: payload?.code ?? "unknown",
      message: payload?.message ?? `Request failed (${response.status}).`,
    } satisfies ApiError;
  }

  // Some successful responses (204, or any endpoint that just doesn't send
  // a body) have nothing to parse — check the raw text first rather than
  // trusting status code alone, which crashed .json() on an empty 200 body.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function listPlatforms(): Promise<PlatformResponse[]> {
  return request("/platforms");
}

export function createPlatform(payload: PlatformPayload): Promise<PlatformResponse> {
  return request("/platforms", { method: "POST", body: JSON.stringify(payload) });
}

export function updatePlatform(id: string, payload: PlatformPayload): Promise<PlatformResponse> {
  return request(`/platforms/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function deletePlatform(id: string): Promise<void> {
  return request(`/platforms/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function connectPlatform(id: string): Promise<{ accounts: DiscoveredAccount[] }> {
  return request(`/platforms/${encodeURIComponent(id)}/connect`, { method: "POST" });
}
