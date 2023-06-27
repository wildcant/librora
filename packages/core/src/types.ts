import type { DatabaseTypes } from 'database/client'

export interface ReservationContext {
  // borrower: DatabaseTypes.User
  // reservation?: DatabaseTypes.Reservation
  error?: string
}

export type BookingArgs = {
  dateRange: { end: Date; start: Date }
  borrower: Pick<DatabaseTypes.User, 'id'>
  book: Pick<DatabaseTypes.Book, 'userId'> & {
    reservedIntervals: {
      end: Date
      start: Date
    }[]
  }
}

export type CancelArgs = {
  requester: Pick<DatabaseTypes.User, 'id'>
  reservation: Pick<DatabaseTypes.Reservation, 'start' | 'borrowerId'>
}

export type DeclineArgs = {
  requester: Pick<DatabaseTypes.User, 'id'>
  reservation: Pick<DatabaseTypes.Reservation, 'lenderId'>
}

export type ReservationEvent =
  | ({ type: 'BOOK' } & BookingArgs)
  | ({ type: Extract<DatabaseTypes.ReservationEvent, 'CANCEL'> } & CancelArgs)
  | { type: Extract<DatabaseTypes.ReservationEvent, 'EXPIRES'> }
  | ({ type: Extract<DatabaseTypes.ReservationEvent, 'DECLINE'> } & DeclineArgs)
  | { type: Extract<DatabaseTypes.ReservationEvent, 'CONFIRM'> }

export type ReservationState =
  | {
      value: 'IDLE'
      context: ReservationContext
    }
  | {
      value: Extract<DatabaseTypes.ReservationStatus, 'PENDING'>
      context: ReservationContext
    }
  | {
      value: Extract<DatabaseTypes.ReservationStatus, 'EXPIRED'>
      context: ReservationContext
    }
  | {
      value: Extract<DatabaseTypes.ReservationStatus, 'CANCELED'>
      context: ReservationContext
    }
  | {
      value: Extract<DatabaseTypes.ReservationStatus, 'DECLINED'>
      context: ReservationContext
    }
  | {
      value: Extract<DatabaseTypes.ReservationStatus, 'CONFIRMED'>
      context: ReservationContext
    }
  | { value: 'ERROR'; context: ReservationContext }
