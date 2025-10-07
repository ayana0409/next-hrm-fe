import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import api from "./utils/api";
import { IUser } from "./types/next-auth";
import { JWT } from "next-auth/jwt";
import { isTokenExpired } from "./library/tokenExpiry";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const response = await api.post("auth/login", {
            username: credentials.username,
            password: credentials.password,
          });
          const { user, accessToken, expiresIn, refreshToken } = response.data;
          if (!user || !accessToken) return null;

          return {
            id: user.id,
            username: user.username,
            role: user.roles,
            access_token: accessToken,
            expiresIn: expiresIn,
            refresh_token: refreshToken,
          };
        } catch (error: any) {
          if (error.response?.status === 401) return null;

          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "signIn" && user) {
        token.user = user as IUser;
        token.access_token = (user as any).access_token;
        token.refresh_token = (user as any).refresh_token;
        token.accessTokenExpires = Date.now() + (user as any).expiresIn * 1000;
        return token;
      }
      if (trigger === "update" && session?.access_token) {
        console.log("update");
        token.access_token = session.access_token;
        token.refresh_token = session.refresh_token;
        token.access_expire = session.access_expire;
        return token;
      }
      if (!token.access_token) return token;

      if (!isTokenExpired(token.access_token)) return token;

      const refreshed = await refreshAccessToken(token as JWT);
      if (!refreshed) return { ...token, error: "RefreshAccessTokenError" };

      return refreshed;
    },
    async session({ session, token }) {
      // map token fields into session for client consumption
      session.access_token = token.access_token as string;
      session.refresh_token = token.refresh_token as string;
      session.accessTokenExpires = token.accessTokenExpires as number;
      session.user = token.user as any;
      session.error = token.error as string | undefined;
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  session: {
    strategy: "jwt",
    updateAge: 300000,
    maxAge: 24 * 60 * 60,
  },
});
export async function refreshAccessToken(token: JWT) {
  try {
    const response = await api.post("/auth/refresh", {
      refresh_token: token.refresh_token,
    });

    const { accessToken, expiresIn, refreshToken } = response.data;
    if (!accessToken) return null;

    if (refreshToken && refreshToken === token.refresh_token) return token;

    return {
      ...token,
      access_token: accessToken,
      accessTokenExpires: Date.now() + expiresIn * 1000,
      refresh_token: refreshToken,
      user: token.user,
    };
  } catch (error: any) {
    console.log(error.message);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
