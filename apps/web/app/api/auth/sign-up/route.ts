import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { signUpSchema } from '@/lib/schemas/sign-up'
import bcrypt from 'bcrypt'
import { prisma } from 'database/server'
import omit from 'lodash/omit'
import { NextRequest } from 'next/server'

// TODO: WIP
export async function POST(req: NextRequest) {
  const data = signUpSchema.parse(await req.json())
  const userExist = await prisma.user.findUnique({ where: { email: data.email } })
  if (userExist) {
    return apiResponse(StatusCode.BAD_REQUEST, {
      errors: [{ title: 'Invalid user input', description: 'Email already exist.' }],
    })
  }

  const newUserData = omit(data, ['password'])
  const password = bcrypt.hashSync(data.password, 10)
  /* const newUser = */ await prisma.user.create({
    data: { ...newUserData, password },
  })
  return {}
}
