'server-only'

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const getSession = () => getServerSession(authOptions)
