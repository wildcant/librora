import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { cloudinary } from '@/lib/cloudinary'
import { prisma } from 'database/server'
import { NextRequest } from 'next/server'

export async function DELETE(_req: NextRequest, { params }: { params: { imageId: string } }) {
  const image = await prisma.image.findUnique({ where: { id: params.imageId } })
  if (!image) {
    return apiResponse(StatusCode.BAD_REQUEST, {
      errors: [{ title: 'Bad user input', description: `Image with id ${params.imageId} doesn't exist.` }],
    })
  }

  await prisma.image.delete({ where: { id: image.id } })

  if (image.publicId) {
    await cloudinary.destroy(image.publicId)
  }

  return apiResponse(StatusCode.OK)
}
