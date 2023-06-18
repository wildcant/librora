import { z } from 'zod'

const MAX_FILE_SIZE = 4000000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpeg', 'image/png', 'image/webp']

export const bookSchema = z.object({
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 4MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
})

export type BookSchema = z.infer<typeof bookSchema>
