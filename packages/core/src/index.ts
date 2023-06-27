import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import differenceInHours from 'date-fns/differenceInHours'
import isAfter from 'date-fns/isAfter'
import subHours from 'date-fns/subHours'
import { assign, createMachine } from 'xstate'
import { ReservationContext, ReservationEvent } from './types'

export const reservationMachine = createMachine(
  {
    id: 'reservation',
    tsTypes: {} as import('./index.typegen').Typegen0,
    schema: {
      context: {} as ReservationContext,
      events: {} as ReservationEvent,
    },
    initial: 'IDLE',
    context: {},
    states: {
      IDLE: {
        on: {
          BOOK: [
            {
              // Validate user is not trying to reserve his own book.
              cond: (_ctx, event) => event.book.userId === event.borrower.id,
              target: 'ERROR',
              actions: assign((_ctx) => ({ error: 'You can not reserve your own books.' })),
            },
            {
              // Validate book is available.
              cond: (_ctx, event) =>
                event.book.reservedIntervals.some((reservedSlot) =>
                  areIntervalsOverlapping(reservedSlot, event.dateRange)
                ),
              target: 'ERROR',
              actions: assign((_ctx) => ({ error: 'Book is not available during this date range.' })),
            },
            { target: 'PENDING' },
          ],
        },
      },
      PENDING: {
        on: {
          CANCEL: [
            {
              cond: 'requesterNotBorrower',
              target: 'ERROR',
              actions: assign((_ctx) => ({ error: "You're not allowed to cancel this reservation." })),
            },
            { target: 'CANCELED' },
          ],
          EXPIRES: { target: 'EXPIRED' },
          DECLINE: [
            {
              cond: 'requesterNotLender',
              target: 'ERROR',
              actions: assign((_ctx) => ({ error: "You're not allowed to decline this reservation." })),
            },
            { target: 'DECLINED' },
          ],
          CONFIRM: { target: 'CONFIRMED' },
        },
      },
      DECLINED: {},
      EXPIRED: {},
      CONFIRMED: {
        on: {
          CANCEL: [
            {
              cond: 'requesterNotBorrower',
              target: 'ERROR',
              actions: assign((_ctx) => ({ error: "You're not allowed to cancel this reservation." })),
            },
            {
              // Validate confirmed reservations can only be canceled 24 hours (or more hours) before reservation start date.
              cond: (_ctx, event) => isAfter(new Date(), subHours(new Date(event.reservation.start), 24)),
              target: 'ERROR',
              actions: assign((_ctx, event) => ({
                error: `Not allowed to cancel CONFIRMED reservation. The start date of the reservation was scheduled to happen in ${differenceInHours(
                  new Date(),
                  new Date(event.reservation.start)
                )} hours.`,
              })),
            },
            { target: 'CANCELED' },
          ],
        },
      },
      CANCELED: {},
      ERROR: {},
    },
  },
  {
    guards: {
      // Validate requester user is the reservation borrower.
      requesterNotBorrower: (_context, event) => event.requester.id !== event.reservation.borrowerId,
      // Validate requester user is the reservation lender.
      requesterNotLender: (_context, event) => event.requester.id !== event.reservation.lenderId,
    },
  }
)
