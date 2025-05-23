import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userManager } from "@/lib/db";

// Mock user database - in a real app, you would use a proper database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "password123",
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await userManager.validateCredentials(
            credentials.email,
            credentials.password
          );

          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
});

export { handler as GET, handler as POST }; 