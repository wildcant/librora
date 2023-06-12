import { env } from '@/lib/env'
import { loginSchema } from '@/lib/schemas/login'
import { FetchResourceResponse, Resource, ResponseError, SanitizedUser } from '@/lib/types'
import bcrypt from 'bcrypt'
import { prisma } from 'database/server'
import { SignJWT, decodeJwt } from 'jose'
import omit from 'lodash/omit'

export async function POST(req: Request) {
  const { email, password } = loginSchema.parse(await req.json())
  const rawUser = await prisma.user.findUnique({ where: { email } })
  const passwordMatched = await bcrypt.compare(password, rawUser?.password ?? '')

  if (!rawUser || !passwordMatched) {
    const errors: ResponseError = [{ title: 'Invalid user input', detail: 'Invalid email or password.' }]
    return new Response(JSON.stringify({ errors }), { status: 400 })
  }

  const user = omit(rawUser, ['password'])
  const secret = new TextEncoder().encode(env.JWT_SECRET)
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(env.JWT_EXPIRATION)
    .sign(secret)
  const expires = decodeJwt(token).exp as number

  const res: FetchResourceResponse<SanitizedUser, { token: string; expires: number }> = {
    data: {
      type: Resource.USERS,
      id: user.id,
      attributes: omit(user, ['id']),
      meta: { token, expires },
    },
  }
  return new Response(JSON.stringify(res), { status: 200 })
}
