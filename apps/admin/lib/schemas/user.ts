import { Role, Status, Type } from 'database/client'
import z from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, { message: 'This field is required' }),
  lastName: z.string().min(1, { message: 'This field is required' }),
  type: z.nativeEnum(Type),
  role: z.nativeEnum(Role),
  password: z.string().min(1, { message: 'This field is required' }),
  status: z.nativeEnum(Status),
})

export type UserSchema = typeof userSchema
export type IUserSchema = z.infer<typeof userSchema>
