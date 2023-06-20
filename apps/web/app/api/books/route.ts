import { getCurrentUser } from '@/lib/get-current-user'
import { BookSchema, bookSchema } from '@/lib/schemas/book'
import { ApiResponse, ResponseError } from '@/lib/types'
import { Book, prisma } from 'database/server'
import { z } from 'zod'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    const errors: ResponseError = [
      { title: 'Unauthorized', detail: 'Please login in order to upload a book.' },
    ]
    return new Response(JSON.stringify({ errors }), { status: 401 })
  }

  let bookData: BookSchema
  try {
    const formData = await req.json()
    bookData = bookSchema.parse(formData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ResponseError = error.issues.map((issue) => ({
        title: 'Invalid Attribute',
        detail: `${issue.path.join(',')} ${issue.message}`,
      }))
      return new Response(JSON.stringify({ errors }), { status: 400 })
    }

    const errors: ResponseError = [
      {
        title: 'The backend responded with an error',
        detail: 'Unexpected error when validating user input.',
      },
    ]

    return new Response(JSON.stringify({ errors }), { status: 500 })
  }

  const newBook = await prisma.book.create({
    data: {
      imageId: bookData.image,
      title: bookData.title,
      description: bookData.description,
      date: bookData.date,
      numPages: bookData.numPages,
      slug: bookData.title.split(' ').join('-'),
      userId: user.id,
    },
  })

  const res: ApiResponse<Book> = { data: newBook }
  return new Response(JSON.stringify(res), { status: 200 })
}
