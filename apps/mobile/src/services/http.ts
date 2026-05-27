import { getNetworkStateAsync } from "expo-network";
import { useAuthStore } from "../stores";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken
} from "./auth-token";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

export interface HttpRequestOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  data?: TBody;
  headers?: Record<string, string>;
  skipAuthRefresh?: boolean;
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

interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
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

let refreshPromise: Promise<string | null> | null = null;

export async function http<TResponse, TBody = unknown>(
  path: string,
  options: HttpRequestOptions<TBody> = {}
): Promise<TResponse> {
  await assertNetworkAvailable();

  const firstResponse = await sendRequest<TBody>(path, options);
  const firstBody = (await parseJson(firstResponse)) as ApiEnvelope<TResponse>;

  if (
    firstResponse.status === 401 &&
    !options.skipAuthRefresh &&
    !isRefreshPath(path)
  ) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      const retryResponse = await sendRequest<TBody>(path, options, refreshedToken);
      const retryBody = (await parseJson(retryResponse)) as ApiEnvelope<TResponse>;
      return unwrapResponse<TResponse>(retryResponse, retryBody);
    }
  }

  return unwrapResponse<TResponse>(firstResponse, firstBody);
}

async function assertNetworkAvailable(): Promise<void> {
  const networkState = await getNetworkStateAsync();

  if (networkState.isConnected === false || networkState.isInternetReachable === false) {
    throw new HttpError("Network unavailable", 0, "NETWORK_UNAVAILABLE");
  }
}

async function sendRequest<TBody>(
  path: string,
  options: HttpRequestOptions<TBody>,
  overrideAccessToken?: string
): Promise<Response> {
  const token = overrideAccessToken ?? (await getAccessToken());

  return fetch(buildUrl(path), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    body: options.data === undefined ? undefined : JSON.stringify(options.data)
  });
}

async function refreshAccessToken(): Promise<string | null> {
  refreshPromise ??= refreshAccessTokenOnce().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function refreshAccessTokenOnce(): Promise<string | null> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthState();
    return null;
  }

  try {
    const response = await fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken })
    });
    const body = (await parseJson(response)) as ApiEnvelope<AuthTokenResponse>;

    if (!response.ok) {
      await clearAuthState();
      return null;
    }

    const data = readEnvelopeData<AuthTokenResponse>(body);
    await setAccessToken(data.accessToken);
    await setRefreshToken(data.refreshToken);
    useAuthStore.getState().setAccessToken(data.accessToken);
    useAuthStore.getState().setAuthenticated(true);
    useAuthStore.getState().setBootstrapping(false);

    return data.accessToken;
  } catch {
    await clearAuthState();
    return null;
  }
}

function unwrapResponse<TResponse>(
  response: Response,
  body: ApiEnvelope<TResponse>
): TResponse {
  if (response.ok) {
    return readEnvelopeData<TResponse>(body);
  }

  throw new HttpError(
    body.error?.message ?? body.message ?? "Request failed",
    response.status,
    body.error?.code,
    body.error?.details
  );
}

function readEnvelopeData<TResponse>(body: ApiEnvelope<TResponse>): TResponse {
  if (isApiEnvelope<TResponse>(body) && body.success === true && "data" in body) {
    return body.data as TResponse;
  }

  return body as TResponse;
}

function buildUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return typeof value === "object" && value !== null && "success" in value;
}

function isRefreshPath(path: string): boolean {
  return path === "/auth/refresh" || path.endsWith("/auth/refresh");
}

async function clearAuthState(): Promise<void> {
  await clearTokens();
  useAuthStore.getState().resetAuth();
}
