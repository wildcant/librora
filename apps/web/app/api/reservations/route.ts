import { getCurrentUser } from '@/lib/get-current-user'
import { reservationSchema } from '@/lib/schemas/reservation'
import { ResponseError } from '@/lib/types'
import { prisma } from 'database/server'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'

export async function POST(req: Request) {
  // Validate user is authenticated.
  const { user, expires } = (await getCurrentUser()) ?? {}
  console.log({ user, expires })
  if (!user) {
    const errors: ResponseError = [
      { title: 'Unauthorized', detail: 'Please login in order to request a reservation.' },
    ]
    return new Response(JSON.stringify({ errors }), { status: 401 })
  }

  const data = reservationSchema.parse(await req.json())
  console.log({ data })

  // Validate the book exist.
  const book = await prisma.book.findUnique({ where: { id: data.bookId } })
  if (!book) {
    const errors: ResponseError = [
      { title: 'Not found', detail: `Book with id ${data.bookId} was not found.` },
    ]
    return new Response(JSON.stringify({ errors }), { status: 400 })
  }

  // Validate user is not trying to reserve his own book.
  if (book.userId === user.id) {
    const errors: ResponseError = [
      { title: 'Invalid user input', detail: `You can not reserve your own books.` },
    ]
    return new Response(JSON.stringify({ errors }), { status: 400 })
  }

  // Validate book is available.
  const reservedIntervals = await prisma.reservation.findMany({
    where: { bookId: data.bookId },
    select: { start: true, end: true },
  })
  if (reservedIntervals.some((reservedSlot) => areIntervalsOverlapping(reservedSlot, data.dateRange))) {
    const errors: ResponseError = [
      { title: 'Invalid user input', detail: 'Book is not available during this date range.' },
    ]
    return new Response(JSON.stringify({ errors }), { status: 400 })
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
    const errors: ResponseError = [
      { title: 'Internal server error', detail: "There was a problem processing you're request." },
    ]
    return new Response(JSON.stringify({ errors }), { status: 500 })
  }

  return new Response(JSON.stringify({ book: response }), { status: 200 })
}
