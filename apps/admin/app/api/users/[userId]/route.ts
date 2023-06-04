import { FetchResourceResponse, Resource, ResponseError, SanitizedUser } from '@/lib/types'
import { prisma } from 'database/server'
import omit from 'lodash/omit'

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } })
  if (!user) return new Response(JSON.stringify({ data: null }), { status: 404 })

  const res: FetchResourceResponse<SanitizedUser> = {
    data: {
      type: Resource.USERS,
      id: user.id,
      attributes: omit(user, ['id', 'password']),
    },
  }
  return new Response(JSON.stringify(res), { status: 200 })
}

export async function PATCH() {}

export async function DELETE(_req: Request, { params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } })
  if (!user) return new Response(JSON.stringify({}), { status: 404 })

  try {
    await prisma.user.delete({ where: { id: params.userId } })
    return new Response(JSON.stringify({}), { status: 200 })
  } catch (error) {
    const res: ResponseError = [
      {
        title: 'The backend responded with an error',
        detail: error instanceof Error ? error.message : 'Was not able to delete the user',
      },
    ]
    return new Response(JSON.stringify(res), { status: 500 })
  }
}
