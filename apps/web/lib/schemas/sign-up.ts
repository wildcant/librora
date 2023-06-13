import { z } from 'zod'
import { userSchema } from './user'

export const signUpSchema = userSchema.pick({ email: true, firstName: true, lastName: true, password: true })
export type SignUpSchema = z.infer<typeof signUpSchema>
