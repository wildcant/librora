// import { prisma } from 'database/server'
import { BookingArgs } from './types'

export const sideEffects = {
  reservation: {
    createReservation: ({ book, borrower, dateRange }: BookingArgs) => {
      // prisma.book.update({ where: { id: book.id }, data: {} })
      // return prisma.book
      //   .update({
      //     where: { id: book.id },
      //     data: {
      //       reservations: {
      //         create: {
      //           borrowerId: borrower.id,
      //           lenderId: book.userId,
      //           start: dateRange.start,
      //           end: dateRange.end,
      //         },
      //       },
      //     },
      //   })
      //   .catch((e) => new Error(e))
    },
  },
}
