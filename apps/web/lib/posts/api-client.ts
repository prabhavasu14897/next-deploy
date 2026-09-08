const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface ApiError {
  code: "not_configured" | "provider_error" | "not_supported" | "unknown";
  message: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
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

  return response.json() as Promise<T>;
}

export function generateImage(prompt: string): Promise<{ imageBase64: string }> {
  return post("/ai/generate-image", { prompt });
}

export function generateCaption(prompt: string, tone: string): Promise<{ caption: string }> {
  return post("/ai/generate-caption", { prompt, tone });
}

export function generateHashtags(content: string, platform: string): Promise<{ hashtags: string[] }> {
  return post("/ai/generate-hashtags", { content, platform });
}

export function rewrite(
  content: string,
  action: "improve" | "shorten" | "grammar",
  tone: string
): Promise<{ content: string }> {
  return post("/ai/rewrite", { content, action, tone });
}

/** One generic publish call for any platform key — not a hardcoded
 *  per-platform function. `platformKey` matches a backend PublishProvider's
 *  `key` (see lib/posts/publish-support.ts). Credentials are resolved
 *  server-side from the Platforms database — never sent from here. */
export function publish(
  platformKey: string,
  input: { imageBase64: string; caption: string }
): Promise<{ externalPostId: string }> {
  return post(`/publish/${encodeURIComponent(platformKey)}`, input);
}
