"use client";

import api from "@/utils/api";
import { getSession, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function NextAuthWarpper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.log("LOGOUT>>>>>>>>>>>>>>>");
      customSignOut();
    }
  }, [session, session?.error]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await getSession();
    }, 100 * 1000); // 30s

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
async function customSignOut(userId?: string) {
  try {
    await api.post("/api/auth/logout");
    if (userId) {
    }
  } catch (err) {
    console.warn("Logout API failed", err);
  } finally {
    signOut({ callbackUrl: "/auth/login" });
  }
}
