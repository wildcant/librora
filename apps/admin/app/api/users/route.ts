import { IUserSchema, userSchema } from '@/lib/schemas/user'
import { ApiResponse, ResponseError, SanitizedUser } from '@/lib/types'
import bcrypt from 'bcrypt'
import { prisma } from 'database/server'
import omit from 'lodash/omit'
import z from 'zod'

export async function POST(req: Request) {
  let user: IUserSchema
  try {
    user = userSchema.parse(await req.json())
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ResponseError = error.issues.map((issue) => ({
        title: 'Invalid Attribute',
        detail: `${issue.path.join(',')} ${issue.message}`,
      }))
      return new Response(JSON.stringify({ errors }), { status: 400 })
    }

    const errors: ResponseError = [
      {
        title: 'The backend responded with an error',
        detail: 'Unexpected error when validating user input.',
      },
    ]

    return new Response(JSON.stringify({ errors }), { status: 500 })
  }

  try {
    const password = bcrypt.hashSync(user.password, 10)
    const newUserData = { ...omit(user, ['password']), password }
    const newUser = await prisma.user.create({ data: newUserData })
    const res: ApiResponse<SanitizedUser> = {
      data: omit(newUser, ['id']),
    }
    return new Response(JSON.stringify(res), { status: 201 })
  } catch (error) {
    console.error(error)
    let errors: ResponseError = [
      {
        title: 'The backend responded with an error',
        detail: error instanceof Error ? error.message : 'There was a problem when trying to create a user.',
      },
    ]
    return new Response(JSON.stringify({ errors }), { status: 500 })
  }
}
