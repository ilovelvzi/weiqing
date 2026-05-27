import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "weiqing.accessToken";
const REFRESH_TOKEN_KEY = "weiqing.refreshToken";

export function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): Promise<void> {
  return SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): Promise<void> {
  return SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
  ]);
}
