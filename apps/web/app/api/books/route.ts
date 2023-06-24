import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { getCurrentUser } from '@/lib/get-current-user'
import { BookSchema, bookSchema } from '@/lib/schemas/book'
import { Book, prisma } from 'database/server'
import { z } from 'zod'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return apiResponse(StatusCode.UNAUTHORIZED, { errorMessage: 'Please login in order to upload a book.' })
  }

  let bookData: BookSchema
  try {
    const formData = await req.json()
    bookData = bookSchema.parse(formData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiResponse(StatusCode.BAD_REQUEST, {
        errors: error.issues.map((issue) => ({
          title: 'Invalid Attribute',
          description: `${issue.path.join(',')} ${issue.message}`,
        })),
      })
    }
    return apiResponse(StatusCode.INTERNAL_SERVER_ERROR, {
      errorMessage: 'Unexpected error when validating user input.',
    })
  }

  const newBook = await prisma.book.create({
    data: {
      imageId: bookData.image,
      title: bookData.title,
      description: bookData.description,
      date: bookData.date.toISOString(),
      numPages: bookData.numPages,
      slug: bookData.title.split(' ').join('-'),
      userId: user.id,
    },
  })

  return apiResponse<Book>(StatusCode.OK, { data: newBook })
}
