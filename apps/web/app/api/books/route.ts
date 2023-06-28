import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { BookSchema, bookSchema } from '@/lib/schemas/book'
import { Book, prisma } from 'database/server'
import { pick } from 'lodash'
import { NextRequest } from 'next/server'
import {
  BodyParserExtension,
  Callback,
  ExtendedRequest,
  UserValidationExtension,
  parseBody,
  route,
  validateUser,
} from '../middlewares'

type CreateBook = Callback<ExtendedRequest<UserValidationExtension & BodyParserExtension<BookSchema>>>
const createBook: CreateBook = async (request) => {
  const newBook = await prisma.book.create({
    data: {
      ...pick(request.data, ['date', 'description', 'imageId', 'numPages', 'title']),
      slug: request.data.title.split(' ').join('-'),
      userId: request.user.id,
    },
  })
  return apiResponse<Book>(StatusCode.OK, { data: newBook })
}

export const POST = (request: NextRequest) =>
  route(request).use(validateUser).use(parseBody(bookSchema)).use(createBook).exec()
