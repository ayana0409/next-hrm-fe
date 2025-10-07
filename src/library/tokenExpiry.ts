// lib/tokenExpiry.ts
import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  exp?: number; // seconds since epoch
  iat?: number;
  [k: string]: any;
};

const DEFAULT_MARGIN_MS = 30_000; // 30 seconds margin to avoid race

export function isProbablyJwt(token?: string | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 3;
}

/**
 * Decode token and return exp timestamp in ms, or null if not available.
 * Does NOT verify signature.
 */
export function getTokenExpiryMs(token?: string | null): number | null {
  if (!token) return null;
  if (!isProbablyJwt(token)) return null;

  try {
    const payload = jwtDecode<JwtPayload>(token);
    if (!payload || typeof payload.exp !== "number") return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

/**
 * Check whether token is expired considering an optional margin (ms).
 * - token: raw access token string (JWT expected)
 * - marginMs: safety margin in milliseconds (default 30s)
 *
 * Returns:
 * - true  => token is expired or about to expire within margin
 * - false => token still valid beyond margin
 */
export function isTokenExpired(
  token?: string | null,
  marginMs = DEFAULT_MARGIN_MS
): boolean {
  const expMs = getTokenExpiryMs(token);
  if (!expMs) {
    // If we cannot decode expiry (opaque token), treat as "unknown" => return true to force refresh
    return true;
  }
  return Date.now() + marginMs >= expMs;
}
