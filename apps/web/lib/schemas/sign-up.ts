import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string({ required_error: 'Email is required.' }).email(),
  firstName: z
    .string({ required_error: 'First name is required.' })
    .min(1, { message: 'Your first name is too small.' })
    .max(50, { message: 'Your first name is too long.' }),
  lastName: z
    .string({ required_error: 'Last name is required.' })
    .min(1, { message: 'Your last name is too small.' })
    .max(50, { message: 'Your last name is too long.' }),
  password: z
    .string({ required_error: 'Password is required.' })
    .min(5, { message: 'Password must contain at least 5 characters.' })
    .max(50),
})
export type SignUpSchema = z.infer<typeof signUpSchema>
