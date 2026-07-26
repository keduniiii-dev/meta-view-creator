export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
};

export const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  return configured ? configured.replace(/\/+$/, "") : "/api";
};

const buildApiUrl = (path: string, params?: Record<string, string | number | boolean | undefined>) => {
  const normalizedBase = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const withQuery = params
    ? `${normalizedBase}${normalizedPath}?${new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {})
      ).toString()}`
    : `${normalizedBase}${normalizedPath}`;

  if (/^https?:\/\//i.test(normalizedBase)) {
    return withQuery;
  }

  return `${window.location.origin}${withQuery}`;
};

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const getErrorMessage = (payload: unknown, status: number) => {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const message = (payload as Record<string, unknown>).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return `Request failed with status ${status}`;
};

export const apiRequest = async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { method = "GET", body, headers, params, credentials = "include", signal } = options;
  const hasBody = body !== undefined && method !== "GET" && method !== "HEAD";

  const response = await fetch(buildApiUrl(path, params), {
    method,
    credentials,
    signal,
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, response.status));
  }

  return payload as T;
};
