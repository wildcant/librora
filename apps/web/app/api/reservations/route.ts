import {
  BodyParserExtension,
  Callback,
  ExtendedRequest,
  UserValidationExtension,
  parseBody,
  route,
  validateUser,
} from '@/app/api/middlewares'
import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { ReservationSchema, reservationSchema } from '@/lib/schemas/reservation'
import { reservationMachine } from 'core'
import { prisma } from 'database/server'
import merge from 'lodash/merge'
import pick from 'lodash/pick'
import { NextRequest } from 'next/server'

const createReservation: Callback<
  ExtendedRequest<UserValidationExtension & BodyParserExtension<ReservationSchema>>
> = async (req) => {
  const { data, user } = req
  const book = await prisma.book.findUnique({ where: { id: data.bookId } })
  if (!book) {
    return apiResponse(StatusCode.NOT_FOUND, {
      errorMessage: `Book with id ${data.bookId} was not found.`,
    })
  }

  const reservedIntervals = await prisma.reservation.findMany({
    where: { bookId: data.bookId, status: { notIn: ['CANCELED', 'DECLINED', 'EXPIRED'] } },
    select: { start: true, end: true },
  })

  const newState = reservationMachine.transition('IDLE', {
    type: 'BOOK',
    borrower: pick(user, 'id'),
    dateRange: data.dateRange,
    book: merge(pick(book, ['userId']), { reservedIntervals }),
  })

  if (newState.value === 'ERROR') {
    if (newState.context?.error) {
      return apiResponse(StatusCode.BAD_REQUEST, {
        errors: [{ title: 'Invalid user input', description: newState.context.error }],
      })
    } else {
      return apiResponse(StatusCode.INTERNAL_SERVER_ERROR, {
        errorMessage: "There was a problem processing you're request.",
      })
    }
  }

  const response = await prisma.book
    .update({
      where: { id: data.bookId },
      data: {
        reservations: {
          create: {
            borrowerId: user.id,
            lenderId: book.userId,
            start: data.dateRange.start,
            end: data.dateRange.end,
          },
        },
      },
    })
    .catch((e) => new Error(e))

  if (response instanceof Error) {
    console.error(response)
    return apiResponse(StatusCode.INTERNAL_SERVER_ERROR, {
      errorMessage: "There was a problem processing you're request.",
    })
  }

  return apiResponse(StatusCode.OK)
}

export const POST = (rawRequest: NextRequest) =>
  route(rawRequest).use(validateUser).use(parseBody(reservationSchema)).use(createReservation).exec()
