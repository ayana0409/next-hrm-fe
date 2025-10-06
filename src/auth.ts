import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import api from "./utils/api";
import { IUser } from "./types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
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
          const user = response.data.user;
          if (user) {
            return {
              id: user.id,
              username: user.username,
              role: user.roles,
              access_token: response.data.accessToken,
              expiresIn: response.data.expiresIn,
            };
          }

          return null;
        } catch (error: any) {
          if (error.response?.status === 401) {
            return null;
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // if (user) {
      //   token.user = user as IUser;
      //   return token;
      // } else {""
      //   return await refreshAccessToken(token);
      // }
      if (user) {
        token.user = user as IUser;
        token.access_token = (user as any).access_token;

        token.accessTokenExpires = Date.now() + (user as any).expiresIn * 1000;
        return token;
      }
      if (!token.access_token) {
        return token;
      }
      // 🔵 Nếu access token chưa hết hạn thì dùng lại
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      session.access_token = token.access_token;
      session.error = token.error;
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});

async function refreshAccessToken(token: any) {
  try {
    console.log("Refreshing");
    const response = await api.post("/auth/refresh");

    const refreshed = response.data;
    console.log("REF>>>>>>", refreshed);
    return {
      ...token,
      access_token: refreshed.accessToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("Refresh token failed", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
