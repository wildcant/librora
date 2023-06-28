import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { cloudinary } from '@/lib/cloudinary'
import { prisma } from 'database/server'
import { NextRequest } from 'next/server'
import { Callback, ExtendedRequest, UserValidationExtension, route, validateUser } from '../../middlewares'

type DeleteBook = Callback<ExtendedRequest<UserValidationExtension>, { params: { imageId: string } }>
const deleteBook: DeleteBook = async (_req, options) => {
  const image = await prisma.image.findUnique({ where: { id: options.params.imageId } })
  if (!image) {
    return apiResponse(StatusCode.NOT_FOUND, {
      errorMessage: `Image with id ${options.params.imageId} was not found.`,
    })
  }

  await prisma.image.delete({ where: { id: image.id } })

  if (image.publicId) {
    await cloudinary.destroy(image.publicId)
  }

  return apiResponse(StatusCode.OK)
}

export const DELETE = (request: NextRequest) => route(request).use(validateUser).use(deleteBook).exec()
