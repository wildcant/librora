import { z } from 'zod'

const envSchema = z.object({
  WEB_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  NEXTAUTH_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
