import { z } from 'zod'
import { userSchema } from './user'

export const nameSchema = userSchema.pick({ firstName: true, lastName: true })
export type NameSchema = z.infer<typeof nameSchema>
