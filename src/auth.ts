import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import api from "./utils/api";
import { IUser } from "./types/next-auth";
import { JWT } from "next-auth/jwt";

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
        return token;
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // map token fields into session for client consumption
      session.access_token = token.access_token as string;
      session.refresh_token = token.refresh_token as string;
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
    // updateAge: 300000,
    maxAge: 24 * 60 * 60,
  },
});
async function refreshAccessToken(token: JWT) {
  try {
    console.log("Old", token.refresh_token);
    const response = await api.post("/auth/refresh", {
      refresh_token: token.refresh_token,
    });

    const { accessToken, expiresIn, refreshToken } = response.data;
    if (!accessToken) return null;
    console.log("new", refreshToken);

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
