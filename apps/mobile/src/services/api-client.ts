import { http, type HttpRequestOptions } from "./http";

export const apiClient = {
  get: <TResponse>(path: string, options?: Omit<HttpRequestOptions, "method" | "data">) =>
    http<TResponse>(path, { ...options, method: "GET" }),
  post: <TResponse, TBody = unknown>(
    path: string,
    data?: TBody,
    options?: Omit<HttpRequestOptions<TBody>, "method" | "data">
  ) => http<TResponse, TBody>(path, { ...options, method: "POST", data }),
  patch: <TResponse, TBody = unknown>(
    path: string,
    data?: TBody,
    options?: Omit<HttpRequestOptions<TBody>, "method" | "data">
  ) => http<TResponse, TBody>(path, { ...options, method: "PATCH", data }),
  delete: <TResponse>(path: string, options?: Omit<HttpRequestOptions, "method" | "data">) =>
    http<TResponse>(path, { ...options, method: "DELETE" })
};
