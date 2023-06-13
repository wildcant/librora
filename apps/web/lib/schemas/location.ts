import { Country } from 'database/client'
import { z } from 'zod'

export const locationSchema = z.object({
  country: z.nativeEnum(Country),
  city: z.string(),
  zipcode: z.string(),
})
export type LocationSchema = z.infer<typeof locationSchema>
