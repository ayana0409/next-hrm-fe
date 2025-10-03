"use client";

import { SessionProvider } from "next-auth/react";

export default function NextAuthWarpper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
