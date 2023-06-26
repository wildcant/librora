import { expect, test } from 'vitest'
import { reservationMachine } from '../src'
import { borrower } from './mock-data'
import { ReservationStatus } from 'database/client'

test('should not allow booking if the requested date range overlaps with an already reserved date range', async () => {
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
})

test('should not allow booking if the borrower is the owner of the book', async () => {
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

test('should transition to pending if all condition are met', async () => {
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
