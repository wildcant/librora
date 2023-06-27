import { ReservationStatus } from 'database/client'
import { addHours } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { reservationMachine } from '../src'
import { borrower, owner } from './mock-data'

describe('general reservation machine assertions', () => {
  it.concurrent(
    'reservation fsm states should be the same defined in DB schema, excluding IDLE and ERROR',
    () => {
      const additionalStates = ['IDLE', 'ERROR']
      Object.keys(reservationMachine.states)
        .filter((machineState) => !additionalStates.includes(machineState))
        .forEach((machineState) => {
          expect(Object.values(ReservationStatus).includes(machineState as ReservationStatus)).toBe(true)
        })
    }
  )
})

describe('booking event', () => {
  it.concurrent(
    'should not allow booking if the requested date range overlaps with an already reserved date range',
    () => {
      const newState = reservationMachine.transition('IDLE', {
        type: 'BOOK',
        borrower,
        book: {
          userId: 'cljbn2s6c0000vkx1nvlyv5sv',
          reservedIntervals: [
            { start: new Date('2023-06-26T05:00:00.000Z'), end: new Date('2023-06-29T05:00:00.000Z') },
          ],
        },
        dateRange: { start: new Date('2023-06-28T05:00:00.000Z'), end: new Date('2023-07-02T05:00:00.000Z') },
      })

      expect(newState.changed).toBe(true)
      expect(newState.value).toBe('ERROR')
      expect(newState.context.error).toBeDefined()
    }
  )

  it.concurrent('should not allow booking if the borrower is the owner of the book', () => {
    const newState = reservationMachine.transition('IDLE', {
      type: 'BOOK',
      borrower,
      book: {
        userId: borrower.id,
        reservedIntervals: [
          { start: new Date('2023-06-26T05:00:00.000Z'), end: new Date('2023-06-29T05:00:00.000Z') },
        ],
      },
      dateRange: { start: new Date('2023-06-30T05:00:00.000Z'), end: new Date('2023-07-02T05:00:00.000Z') },
    })

    expect(newState.changed).toBe(true)
    expect(newState.value).toBe('ERROR')
    expect(newState.context.error).toBeDefined()
  })

  it.concurrent('should transition to pending if all condition are met', () => {
    const newState = reservationMachine.transition('IDLE', {
      type: 'BOOK',
      borrower,
      book: {
        userId: 'cljbn2yo10060vkx14v4d4nky',
        reservedIntervals: [
          { start: new Date('2023-06-26T05:00:00.000Z'), end: new Date('2023-06-29T05:00:00.000Z') },
        ],
      },
      dateRange: { start: new Date('2023-06-30T05:00:00.000Z'), end: new Date('2023-07-02T05:00:00.000Z') },
    })

    expect(newState.changed).toBe(true)
    expect(newState.value).toBe(ReservationStatus.PENDING)
    expect(newState.context.error).toBeUndefined()
  })
})

describe('cancel event', () => {
  it.concurrent('should not allow to cancel pending reservations.', () => {
    expect(
      reservationMachine.transition(ReservationStatus.PENDING, {
        type: 'CANCEL',
        requester: { id: borrower.id },
        reservation: { start: new Date(), borrowerId: borrower.id },
      }).value
    ).toBe('CANCELED')
  })

  it.concurrent('should allow to cancel confirmed reservations that start in more than 24 hours.', () => {
    expect(
      reservationMachine.transition(ReservationStatus.CONFIRMED, {
        type: 'CANCEL',
        requester: { id: borrower.id },
        reservation: { start: addHours(new Date(), 25), borrowerId: borrower.id },
      }).value
    ).toBe(ReservationStatus.CANCELED)
  })

  it.concurrent('should not allow to cancel confirmed reservations that start in less than 24 hours.', () => {
    const { value, context } = reservationMachine.transition(ReservationStatus.CONFIRMED, {
      type: 'CANCEL',
      requester: { id: borrower.id },
      reservation: { start: addHours(new Date(), 23), borrowerId: borrower.id },
    })
    expect(value).toBe('ERROR')
    expect(context?.error).toBeDefined()
  })

  it.concurrent(
    'should not allow other users that are not the reservation borrower to cancel the reservation',
    () => {
      const { value, context } = reservationMachine.transition(ReservationStatus.CONFIRMED, {
        type: 'CANCEL',
        requester: { id: owner.id },
        reservation: { start: addHours(new Date(), 25), borrowerId: borrower.id },
      })
      expect(value).toBe('ERROR')
      expect(context?.error).toBeDefined()
    }
  )
})
