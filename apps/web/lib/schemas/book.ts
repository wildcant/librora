import { z } from 'zod'

export const bookSchema = z.object({
  image: z.string({ required_error: 'Image is required.' }),
  title: z.string({ required_error: 'Title is required.' }),
  description: z.string({ required_error: 'Description is required.' }),
  date: z.coerce.date({ required_error: 'Date is required.' }),
  numPages: z
    .number({ required_error: 'Number of pages is required.', coerce: true })
    .min(1, { message: 'The number of pages can not be 0 or a negative number.' }),
})

export type BookSchema = z.infer<typeof bookSchema>
