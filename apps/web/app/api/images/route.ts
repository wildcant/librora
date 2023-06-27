import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { cloudinary } from '@/lib/cloudinary'
import { Image, prisma } from 'database/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const imageFile = formData.get('file') as File

  if (!imageFile) {
    return apiResponse(StatusCode.BAD_REQUEST, { errorMessage: 'Missing image file.' })
  }

  const response = await cloudinary.unsigned_upload(imageFile)

  if (response instanceof Error) {
    console.error(response)
    return apiResponse(StatusCode.INTERNAL_SERVER_ERROR, {
      errorMessage: "There was a problem saving you're image please contact Admin.",
    })
  }

  const image = await prisma.image.create({
    data: {
      url: response.secure_url,
      publicId: response.public_id,
    },
  })

  return apiResponse<Image>(StatusCode.OK, { data: image })
}
