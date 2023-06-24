import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { getCurrentUser } from '@/lib/get-current-user'
import { reservationSchema } from '@/lib/schemas/reservation'
import { prisma } from 'database/server'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'

export async function POST(req: Request) {
  // Validate user is authenticated.
  const user = await getCurrentUser()
  if (!user) {
    return apiResponse(StatusCode.UNAUTHORIZED, {
      errorMessage: 'Please login in order to request a reservation.',
    })
  }

  const data = reservationSchema.parse(await req.json())

  // Validate the book exist.
  const book = await prisma.book.findUnique({ where: { id: data.bookId } })
  if (!book) {
    return apiResponse(StatusCode.NOT_FOUND, { errorMessage: `Book with id ${data.bookId} was not found.` })
  }

  // Validate user is not trying to reserve his own book.
  if (book.userId === user.id) {
    return apiResponse(StatusCode.BAD_REQUEST, {
      errors: [{ title: 'Invalid user input', description: `You can not reserve your own books.` }],
    })
  }

  // Validate book is available.
  const reservedIntervals = await prisma.reservation.findMany({
    where: { bookId: data.bookId },
    select: { start: true, end: true },
  })
  if (reservedIntervals.some((reservedSlot) => areIntervalsOverlapping(reservedSlot, data.dateRange))) {
    return apiResponse(StatusCode.BAD_REQUEST, {
      errors: [{ title: 'Invalid user input', description: 'Book is not available during this date range.' }],
    })
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
      errors: [
        { title: 'Internal server error', description: "There was a problem processing you're request." },
      ],
    })
  }

  return apiResponse(StatusCode.OK)
}
