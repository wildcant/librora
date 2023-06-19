import { cloudinary } from '@/lib/cloudinary'
import { ResponseError } from '@/lib/types'
import { prisma } from 'database/server'

export async function DELETE(_req: Request, { params }: { params: { imageId: string } }) {
  const image = await prisma.image.findUnique({ where: { id: params.imageId } })
  if (!image) {
    const errors: ResponseError = [
      {
        title: 'Bad user input',
        detail: `Image with id ${params.imageId} doesn't exist.`,
      },
    ]

    return new Response(JSON.stringify({ errors }), { status: 400 })
  }

  await prisma.image.delete({ where: { id: image.id } })

  if (image.publicId) {
    await cloudinary.destroy(image.publicId)
  }

  return new Response(JSON.stringify(''), { status: 200 })
}
