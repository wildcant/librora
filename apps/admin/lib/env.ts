import { z } from 'zod'

const envSchema = z.object({
  ADMIN_URL: z.string(),
})

export const env = envSchema.parse(process.env)
