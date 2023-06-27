import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { userSchema } from '@/lib/schemas/user'
import { SanitizedUser } from '@/lib/types'
import bcrypt from 'bcrypt'
import { prisma } from 'database/server'
import omit from 'lodash/omit'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } })
  if (!user)
    return apiResponse(StatusCode.NOT_FOUND, { errorMessage: `User with id ${params.userId} was not found.` })

  try {
    const formData = await req.json()
    let data = userSchema.partial().parse(formData)
    if (data.password) {
      const password = bcrypt.hashSync(data.password, 10)
      data = { ...data, password }
    }
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        ...omit(data, ['location']),
        ...(data?.location ? { location: { update: data.location } } : {}),
      },
      include: { location: true },
    })

    return apiResponse<SanitizedUser>(StatusCode.OK, { data: omit(updatedUser, ['password']) })
  } catch (error) {
    console.error(error)
    return apiResponse(StatusCode.INTERNAL_SERVER_ERROR, {
      errorMessage: 'There was a problem in the server. Please contact admin.',
    })
  }
}
