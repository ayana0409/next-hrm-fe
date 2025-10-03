"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
