import { assign, createMachine } from '@xstate/fsm'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import { ReservationContext, ReservationEvent, ReservationState } from './types'

export const reservationMachine = createMachine<ReservationContext, ReservationEvent, ReservationState>({
  id: 'reservation',
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
        CANCEL: {
          target: 'CANCELED',
        },
        EXPIRES: {
          target: 'EXPIRED',
        },
        DECLINE: {
          target: 'DECLINED',
        },
        CONFIRM: {
          target: 'CONFIRMED',
        },
      },
    },
    CANCELED: {},
    DECLINED: {},
    EXPIRED: {},
    CONFIRMED: {},
    ERROR: {},
  },
})
