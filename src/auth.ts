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
          const user = response.data.data.user;
          if (user) {
            return {
              id: user.id,
              username: user.username,
              role: user.roles,
              access_token: response.data.data.accessToken,
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
    jwt({ token, user }) {
      if (user) {
        token.user = user as IUser;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      return session;
    },
  },
});
