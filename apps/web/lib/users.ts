import { prisma } from 'database/server'
import 'server-only'

export const fetchUsers = () => prisma.user.findMany()
