import { signUpSchema } from '@/lib/schemas/sign-up'
import { ResponseError } from '@/lib/types'
import bcrypt from 'bcrypt'
import { prisma } from 'database/server'
import omit from 'lodash/omit'

// TODO: WIP
export async function POST(req: Request) {
  const data = signUpSchema.parse(await req.json())
  const userExist = await prisma.user.findUnique({ where: { email: data.email } })
  if (userExist) {
    const errors: ResponseError = [{ title: 'Invalid user input', detail: 'Email already exist.' }]
    return new Response(JSON.stringify({ errors }), { status: 400 })
  }

  const newUserData = omit(data, ['password'])
  const password = bcrypt.hashSync(data.password, 10)
  /* const newUser = */ await prisma.user.create({
    data: { ...newUserData, password },
  })
  return {}
}
