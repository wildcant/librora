import { cloudinary } from '@/lib/cloudinary'
import { ApiResponse, ResponseError } from '@/lib/types'
import { Image, prisma } from 'database/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const imageFile = formData.get('file') as File

  if (!imageFile) {
    const errors: ResponseError = [
      {
        title: 'Bad user input',
        detail: `Missing image file.`,
      },
    ]

    return new Response(JSON.stringify({ errors }), { status: 400 })
  }

  const response = await cloudinary.unsigned_upload(imageFile)

  if (response instanceof Error) {
    console.error(response)
    const errors: ResponseError = [
      {
        title: 'Server error',
        detail: `There was a problem saving you're image please contact Admin.`,
      },
    ]

    return new Response(JSON.stringify({ errors }), { status: 500 })
  }

  const image = await prisma.image.create({
    data: {
      url: response.secure_url,
      publicId: response.public_id,
    },
  })

  const res: ApiResponse<Image> = { data: image }
  return new Response(JSON.stringify(res), { status: 200 })
}
