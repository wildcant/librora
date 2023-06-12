import { userSchema } from '@/lib/schemas/user'
import { ResponseError } from '@/lib/types'
import { prisma } from 'database/server'
import bcrypt from 'bcrypt'

export async function DELETE(_req: Request, { params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } })
  if (!user) return new Response('', { status: 404 })

  try {
    await prisma.user.delete({ where: { id: params.userId } })
    return new Response('', { status: 200 })
  } catch (error) {
    console.error(error)
    const res: ResponseError = [
      {
        title: 'The backend responded with an error',
        detail: error instanceof Error ? error.message : 'Was not able to delete the user',
      },
    ]
    return new Response(JSON.stringify(res), { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } })
  if (!user) return new Response(JSON.stringify({}), { status: 404 })

  try {
    const formData = await req.json()
    let data = userSchema.partial().parse(formData)
    if (data.password) {
      const password = bcrypt.hashSync(data.password, 10)
      data = { ...data, password }
    }
    const updatedUser = await prisma.user.update({ where: { id: params.userId }, data })
    return new Response(JSON.stringify(updatedUser), { status: 200 })
  } catch (error) {
    console.error(error)
    const res: ResponseError = [
      {
        title: 'The backend responded with an error',
        detail: error instanceof Error ? error.message : 'Was not able to delete the user',
      },
    ]
    return new Response(JSON.stringify(res), { status: 500 })
  }
}
