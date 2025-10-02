"use client";

import { signIn } from "next-auth/react";

export async function authenticate(username: string, password: string) {
  const res = await signIn("credentials", {
    username,
    password,
    redirect: false,
  });

  return res;
}
