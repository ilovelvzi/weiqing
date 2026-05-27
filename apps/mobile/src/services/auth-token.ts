import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const REFRESH_TOKEN_KEY = "weiqing.refreshToken";

let accessToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  return accessToken;
}

export async function setAccessToken(token: string): Promise<void> {
  accessToken = token;
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return getWebRefreshToken();
    }

    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setRefreshToken(token: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      setWebRefreshToken(token);
      return;
    }

    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch {
    // Storage failure should not expose tokens or crash the UI.
  }
}

export async function hasRefreshToken(): Promise<boolean> {
  return Boolean(await getRefreshToken());
}

export async function clearTokens(): Promise<void> {
  accessToken = null;

  try {
    if (Platform.OS === "web") {
      clearWebRefreshToken();
      return;
    }

    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    // Clearing is best-effort across storage backends.
  }
}

function getWebRefreshToken(): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setWebRefreshToken(token: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

function clearWebRefreshToken(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}
