// lib/axiosWithSession.ts
import { auth } from "@/auth";
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";

/* ---------- config ---------- */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
const WAIT_FOR_TOKEN_MS = 10000; // thời gian đợi auth broadcast token mới

/* ---------- storage helpers (client) ---------- */
function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}
function clearStoredTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

/* ---------- helpers: wait for auth token update (BroadcastChannel + storage fallback) ---------- */
function waitForTokenUpdate(
  timeoutMs = WAIT_FOR_TOKEN_MS
): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);

    let resolved = false;
    // If BroadcastChannel available, use it
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("auth");
      }
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
        const data = ev.data;
        if (data?.type === "token-updated") {
          const t = getStoredAccessToken();
          return finish(t);
        }
      } catch {}
    };

    const onStorage = (ev: StorageEvent) => {
      try {
        if (ev.key === "auth:token_updated") {
          const t = getStoredAccessToken();
          return finish(t);
        }
      } catch {}
    };

    const timer = setTimeout(() => finish(null), timeoutMs);

    if (bc) {
      bc.onmessage = onMessage;
    }
    window.addEventListener("storage", onStorage);
  });
}

/* ---------- module-scoped singleton ---------- */
let axiosInstance: AxiosInstance | null = null;

/* ---------- create singleton axios instance ---------- */
export function axiosWithSession(): AxiosInstance {
  if (axiosInstance) return axiosInstance;

  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  // Request interceptor: always read token from storage before sending
  instance.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      const hdrs = new AxiosHeaders(config.headers as any);

      if (typeof window === "undefined") {
        // server-side: use next-auth auth() if available
        try {
          const session = await auth();
          const serverToken =
            (session as any)?.access_token ?? (session as any)?.accessToken;
          if (serverToken) hdrs.set("Authorization", `Bearer ${serverToken}`);
          else hdrs.delete("Authorization");
        } catch {
          hdrs.delete("Authorization");
        }
      } else {
        // client-side: always read the latest from localStorage
        const access = getStoredAccessToken();
        if (access) {
          hdrs.set("Authorization", `Bearer ${access}`);
        } else {
          hdrs.delete("Authorization");
        }
      }

      config.headers = hdrs as unknown as InternalAxiosRequestConfig["headers"];
      return config;
    }
  );

  // Response interceptor: on 401 wait for auth module to provide updated token (do NOT call refresh endpoint here)
  instance.interceptors.response.use(
    (res) => res.data ?? res,
    async (
      error: AxiosError & {
        config?: InternalAxiosRequestConfig & { _retry?: boolean };
      }
    ) => {
      const originalRequest = error?.config;
      const status = error?.response?.status;

      if (!originalRequest || status !== 401) return Promise.reject(error);

      // Avoid retry loops
      if (originalRequest._retry) return Promise.reject(error);
      originalRequest._retry = true;

      console.log("[response] caught 401 for", originalRequest.url);

      // 1) Maybe session already updated in storage by auth module
      const latest = getStoredAccessToken();
      if (latest) {
        // Compare suffix to the Authorization header of originalRequest if present
        try {
          const usedAuth =
            (originalRequest.headers as any)?.Authorization ??
            (originalRequest.headers as any)?.authorization ??
            null;
          const usedSuffix =
            typeof usedAuth === "string" ? usedAuth.slice(-8) : null;
          const latestSuffix = latest.slice(-8);
          // if latest differs from used token, retry immediately with latest
          if (!usedSuffix || usedSuffix !== latestSuffix) {
            console.log(
              "[response] storage token differs from used token, retry with new token (suffix):",
              latestSuffix
            );
            const hdrs = new AxiosHeaders(originalRequest.headers as any);
            hdrs.set("Authorization", `Bearer ${latest}`);
            originalRequest.headers = hdrs as any;
            instance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${latest}`;
            return instance(originalRequest);
          }
        } catch {}
      }

      // 2) Wait for auth module to broadcast token update
      console.log(
        "[response] waiting for auth token update (up to ms):",
        WAIT_FOR_TOKEN_MS
      );
      const newTok = await waitForTokenUpdate(WAIT_FOR_TOKEN_MS);

      if (newTok) {
        console.log(
          "[response] received token update (suffix):",
          newTok.slice(-8)
        );
        const hdrs = new AxiosHeaders(originalRequest.headers as any);
        hdrs.set("Authorization", `Bearer ${newTok}`);
        originalRequest.headers = hdrs as any;
        instance.defaults.headers.common["Authorization"] = `Bearer ${newTok}`;
        return instance(originalRequest);
      }

      // 3) timeout or no token update -> clear and redirect to login
      console.log(
        "[response] no token update received within timeout, redirecting to login"
      );
      if (typeof window !== "undefined") {
        clearStoredTokens();
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }
  );

  axiosInstance = instance;
  return axiosInstance;
}
