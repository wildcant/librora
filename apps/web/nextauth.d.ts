import { DefaultSession, DefaultUser } from 'next-auth'
import { SanitizedUser } from '@/lib/types'

declare module 'next-auth' {
  interface User extends SanitizedUser {}
  interface Session extends DefaultSession {
    user?: SanitizedUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends SanitizedUser {}
}
