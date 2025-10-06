"use client";

import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function SessionWatcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.warn("Refresh token failed, signing out...");
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [session]);

  return <>{children}</>;
}
