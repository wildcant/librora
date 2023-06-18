import { ResponseError } from '@/lib/types'
import fs from 'fs/promises'

export async function POST(req: Request) {
  const formData = await req.formData()
  const image = formData.get('image') as File
  const buffer = Buffer.from(await image.arrayBuffer())
  const saveFileFirstTryResponse = await fs
    .writeFile(`public/${image.name}`, buffer)
    .catch((e) => new Error(e))
  console.log({ saveFileFirstTryResponse })
  const saveFileResponse = await fs.writeFile(`public/books/${image.name}`, buffer).catch((e) => new Error(e))

  if (saveFileResponse instanceof Error) {
    console.error({ saveFileResponse })
    const errors: ResponseError = [
      {
        title: 'Server error',
        detail: `There was a problem saving you're image please contact Admin.`,
        context: saveFileResponse,
      },
    ]
    return new Response(JSON.stringify({ errors }), { status: 500 })
  }

  return new Response(JSON.stringify({ data: { url: `/books/${image.name}` } }), { status: 200 })
}
