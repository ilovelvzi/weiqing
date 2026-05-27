import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "weiqing.refreshToken";

let accessToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  return accessToken;
}

export async function setAccessToken(token: string): Promise<void> {
  accessToken = token;
}

export function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): Promise<void> {
  return SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function hasRefreshToken(): Promise<boolean> {
  return Boolean(await getRefreshToken());
}

export async function clearTokens(): Promise<void> {
  accessToken = null;
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
