import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (user && user.password && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user.id, email: user.email, name: user.name };
        }
        return null;
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}

export { authOptions }

// @ts-ignore - NextAuth v4 typing issue
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 