import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import api from "./utils/api";
import { IUser } from "./types/next-auth";
import { jwtDecode } from "jwt-decode";
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
      if (trigger === "update" && session) {
        // Cập nhật tokens mới từ client update
        token.access_token = session.access_token as string;
        token.refresh_token = session.refresh_token as string;
        console.log("JWT updated with new tokens");
        return token;
      }

      const expiresAt = decodeJwtExpiration(token.access_token);
      const remaining = expiresAt! - Date.now();

      if (!expiresAt || remaining > 30 * 1000) {
        return token;
      }

      return refreshAccessToken(token);
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
    updateAge: 300000,
    maxAge: 24 * 60 * 60,
  },
});

export async function refreshAccessToken(token: JWT) {
  try {
    const res = await api.post("auth/refresh", {
      refresh_token: token.refresh_token,
    });

    const { accessToken, refreshToken } = res.data;

    if (!accessToken) return token;

    return {
      ...token,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

function decodeJwtExpiration(token: string | undefined): number | null {
  try {
    if (token) {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return null;
      return decoded.exp * 1000;
    }
    return null;
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
}
