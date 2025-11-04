"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import api, { axiosAuth } from "./api";
import { io, Socket as ClientSocket } from "socket.io-client";

export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

export function usePaginationQuery(defaultPageSize: number = 10) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = Number(searchParams.get("current") ?? "1");
  const pageSize = Number(
    searchParams.get("pageSize") ?? String(defaultPageSize)
  );

  const updatePagination = (page: number, size: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("current", String(page));
    query.set("pageSize", String(size));
    router.push(`?${query.toString()}`);
  };

  return {
    current,
    pageSize,
    updatePagination,
  };
}

export const useAxiosAuth = (setIsRefreshing?: (value: boolean) => void) => {
  const { data: session, status } = useSession({ required: true });
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${session?.access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          error?.response?.status === 401 &&
          !prevRequest?.sent &&
          session?.refresh_token
        ) {
          setIsRefreshing?.(true);
          prevRequest.sent = true;
          try {
            const { accessToken } = await refreshToken();
            if (!accessToken) {
              // Không có token => không gọi lại request, không trả về gì
              return;
            }
            prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return axiosAuth(prevRequest);
          } catch (refreshError) {
            if (session) session.error = "RefreshAccessTokenError";
            return Promise.reject(refreshError);
          } finally {
            setIsRefreshing?.(false);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session]);
  return axiosAuth;
};

export const useRefreshToken = () => {
  const { data: session, update } = useSession();
  const refreshToken = async () => {
    try {
      const res = await api.post("/auth/refresh", {
        refresh_token: session?.refresh_token,
      });

      const { accessToken, refreshToken } = res.data;
      console.log(res.data);
      if (accessToken && refreshToken !== session?.refresh_token) {
        update({ access_token: accessToken, refresh_token: refreshToken });
      }

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  };

  return refreshToken;
};

const SOCKET_URL = "http://localhost:8080";
export function useNotificationSocket(
  userId: string,
  onMessage: (msg: string) => void
) {
  const socketRef = useRef<ClientSocket | null>(null);

  useEffect(() => {
    // connect socket
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // connect success => send userId to sub
    socket.on("connect", () => {
      socket.emit("register", userId);
    });

    // listening event notification
    socket.on("notification", (data) => {
      onMessage(data.message);
    });

    // disconnect
    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    // Cleanup when unmount
    return () => {
      socket.disconnect();
    };
  }, [userId, onMessage]);

  return socketRef;
}
