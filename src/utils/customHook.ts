"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import api, { axiosAuth } from "./api";

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

export const useAxiosAuth = () => {
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
          prevRequest.sent = true;
          try {
            const { accessToken } = await refreshToken();
            prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return axiosAuth(prevRequest);
          } catch (refreshError) {
            if (session) session.error = "RefreshAccessTokenError";
            return Promise.reject(refreshError);
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
  const { data: session } = useSession();
  const refreshToken = async () => {
    try {
      const res = await api.post("/auth/refresh", {
        refresh_token: session?.refresh_token,
      });

      const { accessToken, refreshToken } = res.data;

      // Cập nhật session bằng cách gọi signIn với credentials mới
      if (session) {
        session.access_token = accessToken;
        session.refresh_token = refreshToken;
      }

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  };

  return refreshToken;
};
