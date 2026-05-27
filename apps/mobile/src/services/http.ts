import { getNetworkStateAsync } from "expo-network";
import { getAccessToken } from "./auth-token";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

export interface HttpRequestOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  data?: TBody;
  headers?: Record<string, string>;
}

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  message?: string;
}

export class HttpError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code = "HTTP_ERROR",
    readonly details?: unknown
  ) {
    super(message);
  }
}

export async function http<TResponse, TBody = unknown>(
  path: string,
  options: HttpRequestOptions<TBody> = {}
): Promise<TResponse> {
  const networkState = await getNetworkStateAsync();

  if (networkState.isConnected === false || networkState.isInternetReachable === false) {
    throw new HttpError("Network unavailable", 0, "NETWORK_UNAVAILABLE");
  }

  const token = await getAccessToken();
  const response = await fetch(buildUrl(path), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    body: options.data === undefined ? undefined : JSON.stringify(options.data)
  });

  const body = (await parseJson(response)) as ApiEnvelope<TResponse>;

  if (response.status === 401) {
    // TODO: Refresh access token once the refresh flow is connected to router redirects.
  }

  if (response.ok) {
    if (isApiEnvelope<TResponse>(body) && body.success === true && "data" in body) {
      return body.data as TResponse;
    }

    return body as TResponse;
  }

  throw new HttpError(
    body.error?.message ?? body.message ?? "Request failed",
    response.status,
    body.error?.code,
    body.error?.details
  );
}

function buildUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return typeof value === "object" && value !== null && "success" in value;
}
