import { z } from 'zod'

export const reservationSchema = z.object({
  bookId: z.string(),
  dateRange: z.object({
    start: z.coerce.date(),
    end: z.coerce.date(),
  }),
})

export type ReservationSchema = z.infer<typeof reservationSchema>
