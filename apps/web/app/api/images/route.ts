import { env } from '@/lib/env'
import { ResponseError } from '@/lib/types'

export interface CloudinaryResponse {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: any[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  original_filename: string
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const image = formData.get('image') as File

  const body = new FormData()
  body.append('file', image)
  body.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET)
  body.append('api_key', env.CLOUDINARY_API_KEY)
  const RESOURCE_TYPE = 'image'

  const uploadApiResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${RESOURCE_TYPE}/upload`,
    { method: 'post', body }
  ).catch((e) => new Error(e))

  if (uploadApiResponse instanceof Error || !uploadApiResponse.ok) {
    console.error(uploadApiResponse)
    const errors: ResponseError = [
      {
        title: 'Server error',
        detail: `There was a problem saving you're image please contact Admin.`,
      },
    ]

    return new Response(JSON.stringify({ errors }), { status: 500 })
  }

  const uploadResponse: CloudinaryResponse = await uploadApiResponse.json()
  console.log({ uploadResponse })

  return new Response(JSON.stringify({ data: { url: uploadResponse.secure_url } }), { status: 200 })
}
