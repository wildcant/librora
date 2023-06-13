import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcrypt'
import { prisma } from 'database/server'
import merge from 'lodash/merge'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.user) {
        token = merge(token, session.user)
      }

      if (user) {
        token.id = user.id
        token.type = user.type
        token.email = user.email
        token.emailVerified = user.emailVerified
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.role = user.role
        token.status = user.status
        token.createdAt = user.createdAt
        token.updatedAt = user.updatedAt
        token.location = user.location
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.type = token.type
        session.user.email = token.email
        session.user.emailVerified = token.emailVerified
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.role = token.role
        session.user.status = token.status
        session.user.location = token.location
        session.user.createdAt = token.createdAt
        session.user.updatedAt = token.updatedAt
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
  pages: { signIn: '/' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { location: true },
        })

        if (!user || !user?.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return user
      },
    }),
  ],
  session: { strategy: 'jwt' },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
