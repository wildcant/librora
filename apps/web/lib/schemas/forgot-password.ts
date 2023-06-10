import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string({ required_error: 'Enter your email' }).email(),
})
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
