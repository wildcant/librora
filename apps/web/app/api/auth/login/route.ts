import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { env } from '@/lib/env'
import { loginSchema } from '@/lib/schemas/login'
import { SanitizedUser } from '@/lib/types'
import bcrypt from 'bcrypt'
import { prisma } from 'database/server'
import { SignJWT, decodeJwt } from 'jose'
import omit from 'lodash/omit'

export async function POST(req: Request) {
  const { email, password } = loginSchema.parse(await req.json())
  const rawUser = await prisma.user.findUnique({ where: { email }, include: { location: true } })
  const passwordMatched = await bcrypt.compare(password, rawUser?.password ?? '')

  if (!rawUser || !passwordMatched) {
    return apiResponse(StatusCode.BAD_REQUEST, {
      errors: [{ title: 'Invalid user input', description: 'Invalid email or password.' }],
    })
  }

  const user = omit(rawUser, ['password'])
  const secret = new TextEncoder().encode(env.JWT_SECRET)
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(env.JWT_EXPIRATION)
    .sign(secret)
  const expires = decodeJwt(token).exp as number

  return apiResponse<SanitizedUser, { token: string; expires: number }>(StatusCode.OK, {
    data: user,
    meta: { token, expires },
  })
}
