// lib/axiosWithSession.ts
import { auth } from "@/auth";
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
const WAIT_FOR_TOKEN_MS = 10000;

/* ---------- Storage helpers (client-only) ---------- */
function isClient() {
  return typeof window !== "undefined";
}

function getStoredAccessToken(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem("access_token");
}

function getStoredRefreshToken(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem("refresh_token");
}

function setStoredTokens(accessToken: string, refreshToken?: string) {
  if (!isClient()) return;
  try {
    localStorage.setItem("access_token", accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
  } catch {}
  broadcastTokenUpdate();
}

function clearStoredTokens() {
  if (!isClient()) return;
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  } catch {}
}

/* ---------- Broadcast ---------- */
function broadcastTokenUpdate() {
  if (!isClient()) return;
  try {
    const bc = new BroadcastChannel("auth");
    bc.postMessage({ type: "token-updated", ts: Date.now() });
    bc.close();
  } catch {}
  try {
    localStorage.setItem("auth:token_updated", String(Date.now()));
  } catch {}
}

/* ---------- Wait for token update (used by requests waiting) ---------- */
function waitForTokenUpdate(
  timeoutMs = WAIT_FOR_TOKEN_MS
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!isClient()) return resolve(null);

    let resolved = false;
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined")
        bc = new BroadcastChannel("auth");
    } catch {
      bc = null;
    }

    const finish = (tok: string | null) => {
      if (resolved) return;
      resolved = true;
      if (bc)
        try {
          bc.close();
        } catch {}
      window.removeEventListener("storage", onStorage);
      clearTimeout(timer);
      resolve(tok);
    };

    const onMessage = (ev: MessageEvent) => {
      try {
        if (ev.data?.type === "token-updated") {
          return finish(getStoredAccessToken());
        }
      } catch {}
    };

    const onStorage = (ev: StorageEvent) => {
      try {
        if (ev.key === "auth:token_updated") {
          return finish(getStoredAccessToken());
        }
      } catch {}
    };

    const timer = setTimeout(() => finish(null), timeoutMs);

    if (bc) bc.onmessage = onMessage;
    window.addEventListener("storage", onStorage);
  });
}

/* ---------- Single-flight refresh helper ---------- */
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  if (!isClient()) return null;

  // reuse ongoing refresh
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) return null;

      // Call your refresh endpoint (must be same-origin or CORS allowing credentials)
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        return null;
      }

      const body = await res.json();
      const newAccess = body.accessToken ?? body.access_token;
      const newRefresh = body.refreshToken ?? body.refresh_token;

      if (!newAccess) return null;

      setStoredTokens(newAccess, newRefresh);
      return newAccess;
    } catch (err) {
      console.warn("performRefresh failed", err);
      return null;
    } finally {
      // allow next refresh after this settles
      setTimeout(() => {
        refreshPromise = null;
      }, 0);
    }
  })();

  return refreshPromise;
}

/* ---------- Axios instance ---------- */
let axiosInstance: AxiosInstance | null = null;

export function axiosWithSession(): AxiosInstance {
  if (axiosInstance) return axiosInstance;

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Request interceptor: only client-side attach token from storage
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (isClient()) {
      const access = getStoredAccessToken();
      const hdrs = new AxiosHeaders(config.headers as any);
      if (access) hdrs.set("Authorization", `Bearer ${access}`);
      else hdrs.delete("Authorization");
      config.headers = hdrs as any;
    }
    return config;
  });

  // Response interceptor: handle 401 -> attempt immediate retry with latest storage token,
  // then wait for broadcast or attempt refresh if needed.
  instance.interceptors.response.use(
    (res) => res,
    async (
      error: AxiosError & {
        config?: InternalAxiosRequestConfig & { _retry?: boolean };
      }
    ) => {
      const originalRequest = error?.config;
      const status = error?.response?.status;

      if (!originalRequest || status !== 401) return Promise.reject(error);
      if (originalRequest._retry) return Promise.reject(error);
      originalRequest._retry = true;

      // If server-side call triggered axios, bail out (can't handle client token here)
      if (!isClient()) return Promise.reject(error);

      console.log("[axiosWithSession] caught 401 for", originalRequest.url);

      // 1) If storage already has a newer token than the one used in header, retry immediately
      try {
        const latest = getStoredAccessToken();
        if (latest) {
          const usedAuth =
            (originalRequest.headers as any)?.Authorization ??
            (originalRequest.headers as any)?.authorization ??
            null;
          const usedToken =
            typeof usedAuth === "string" && usedAuth.startsWith("Bearer ")
              ? usedAuth.slice(7)
              : null;

          const usedSuffix = usedToken?.slice(-12) ?? null;
          const latestSuffix = latest.slice(-12);

          if (!usedSuffix || usedSuffix !== latestSuffix) {
            console.log(
              "[axiosWithSession] storage token differs, retrying with latest (suffix):",
              latestSuffix
            );
            const hdrs = new AxiosHeaders(originalRequest.headers as any);
            hdrs.set("Authorization", `Bearer ${latest}`);
            originalRequest.headers = hdrs as any;
            instance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${latest}`;
            return instance.request(originalRequest);
          }
        }
      } catch (err) {
        console.warn("[axiosWithSession] token compare failed", err);
      }

      // 2) If some other tab is refreshing, wait for token update
      console.log(
        "[axiosWithSession] waiting for token update (ms):",
        WAIT_FOR_TOKEN_MS
      );
      const tokenFromBroadcast = await waitForTokenUpdate(WAIT_FOR_TOKEN_MS);
      if (tokenFromBroadcast) {
        console.log("[axiosWithSession] got token from broadcast, retrying");
        const hdrs = new AxiosHeaders(originalRequest.headers as any);
        hdrs.set("Authorization", `Bearer ${tokenFromBroadcast}`);
        originalRequest.headers = hdrs as any;
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenFromBroadcast}`;
        return instance.request(originalRequest);
      }

      // 3) No broadcast: attempt to refresh here (single-flight)
      console.log("[axiosWithSession] attempting refresh");
      const refreshed = await performRefresh();
      if (refreshed) {
        console.log("[axiosWithSession] refresh succeeded, retrying");
        const hdrs = new AxiosHeaders(originalRequest.headers as any);
        hdrs.set("Authorization", `Bearer ${refreshed}`);
        originalRequest.headers = hdrs as any;
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${refreshed}`;
        return instance.request(originalRequest);
      }

      // 4) Refresh failed: logout + redirect
      console.log(
        "[axiosWithSession] refresh failed, logging out and redirecting to login"
      );
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.warn("logout api failed", err);
      }

      clearStoredTokens();

      // small delay to ensure storage event/broadcast processed
      setTimeout(() => {
        if (isClient()) {
          window.location.href = "/auth/login";
        }
      }, 50);

      return Promise.reject(
        new AxiosError(
          "Session expired, redirected to login",
          "401",
          error.config
        )
      );
    }
  );

  axiosInstance = instance;
  return axiosInstance;
}
