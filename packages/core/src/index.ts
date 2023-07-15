import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import differenceInHours from 'date-fns/differenceInHours'
import isAfter from 'date-fns/isAfter'
import subHours from 'date-fns/subHours'
import { assign, createMachine, StateFrom } from 'xstate'
import { ReservationContext, ReservationEvent } from './types'
import { sideEffects } from './side-effects'

export const reservationMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QCc5mQNwIYBcCWA9gHYB0AkgCIAyAogMQBCA8kwNIDaADALqKgAOBWHnzE+IAB6IAjACYAHCQCs8uUtkB2eQBYAnNp3yANCACeiVSQMalnbRs4BmbY8e7HAXw8nUsdNlFSSlpGFg5pXiQQQWFA8SkEOUUVNU0dfUMTc0SNDRJ5TgA2WUKXV1VdWS8fNExcQiDqemY2dllIgSERBviZFxJS7VlZRwLOAtGsxFldaRJpVVGNQsKVeVGlapBff3riEgAFGgA5CjJjgHE6AGEAQWPrmiouDuiuuKiEg0KSTiV3JQLXQTJSOKYIbTjZQaWaFXQaEq6XScDRbHZ1QKHE5nS43e6PZ4RcQxbpiT6IQE-bSFRzDWRKFzaQHacG2bQken-YEM7TSIq6NG1AINLGnc5XGgADQOZAASjQAMovYnvHrkhBKQp5AxDYplJxKcErWQDdzSJS5BzSJnSQV+DEio5i3EUGjXKjnGjKqIkj6gBKak3aAycekORaOQ1mRCzIPB1yrQYlO27TFOnFXV3uz3sIk+1Vk-2IFa6Ei5Wwac2OOSyaRg6MIWlzama5xIxwaUZ2FMO-bp8U3JjHABicoAst7OrE1UWNTSSK4Uq4MmpwRp7Avxpr9MUMptvNshXtSNch6PZWOaBQ8Q8npO3tPC5IY0jlJx27o9aNaWvZOzRis8i5Fq-w9sK+yniO45XjeBK5q8vozs+iR2I4HLSDSjh-A4yIGOChi-HYIyrAUIyaGBx4kJB56Xtedy3s87Qqo+RC9Ag66KOucKFPI9LSNaoasvIPwwv8y6aIitpbEQBAQHA4jouBrH5ixbEALQwgMOhYfodhais0jgmpSgkEiZkFHWjLFBRmLBDQzGksps5qdWWkuO+kLUsshSGQ2fLspCnBBZWQFwmkNmOti4oOX6yHSAiVh6Lk-ETG4NjggBZbLPFcgosCqIHoplFZh6xxXjFSEJPCpYtuGLiVO+9bZE2pmBly7jOKBhVHpiUoyvKFAVU+VWabV4z1bIjWsj5Vi2Jw1qrOolkRRBZ7QYNKmOWxizQkiuRDLSBTGA2nbstIyI8aC8hKDyhQrSe+JPOVm2xQGejKFhkaOKUk2rEJInCWyDjhm490kDQsqykwspDU5cUGGhCh1rYoLIjYsjgrlViuHo766DdobWV4HhAA */
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
              cond: 'borrowerIsBookOwner',
              target: 'ERROR',
              actions: assign((_ctx) => ({ error: 'You can not reserve your own books.' })),
            },
            {
              cond: 'bookIsAvailable',
              target: 'ERROR',
              actions: assign((_ctx) => ({ error: 'Book is not available during this date range.' })),
            },
            { target: 'PENDING' },
          ],
        },
      },
      PENDING: {
        entry: ['bookReservation'],
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
              cond: 'isTooLateToCancel',
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
      // Validate user is not trying to reserve his own book.
      borrowerIsBookOwner: (_ctx, event) => event.book.userId === event.borrower.id,

      // Validate book is available.
      bookIsAvailable: (_ctx, event) =>
        event.book.reservedIntervals.some((reservedSlot) =>
          areIntervalsOverlapping(reservedSlot, event.dateRange)
        ),

      // Validate confirmed reservations can only be canceled 24 hours (or more hours) before reservation start date.
      isTooLateToCancel: (_ctx, event) =>
        isAfter(new Date(), subHours(new Date(event.reservation.start), 24)),

      // Validate requester user is the reservation borrower.
      requesterNotBorrower: (_context, event) => event.requester.id !== event.reservation.borrowerId,

      // Validate requester user is the reservation lender.
      requesterNotLender: (_context, event) => event.requester.id !== event.reservation.lenderId,
    },
    actions: {
      bookReservation: (_context, event) => sideEffects.reservation.createReservation(event),
    },
  }
)

export type ReservationMachineState = StateFrom<typeof reservationMachine>
export type { BookingArgs } from './types'
