'server-only'

import { z } from 'zod'

const envSchema = z.object({
  WEB_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLOUDINARY_UPLOAD_PRESET: z.string(),
})

export const env = envSchema.parse(process.env)
