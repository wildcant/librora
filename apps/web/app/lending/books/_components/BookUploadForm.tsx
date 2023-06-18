'use client'

import { Button } from '@/components/ui/Button'
import { Dropzone } from '@/components/ui/Dropzone'
import { FormField } from '@/components/ui/Form'
import { BookSchema, bookSchema } from '@/lib/schemas/book'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image } from 'lucide-react'
import { Form, useForm } from 'react-hook-form'

export function BookUploadForm() {
  const form = useForm<BookSchema>({
    resolver: zodResolver(bookSchema),
  })

  return (
    <div>
      <Form {...form} method="post" action="/api/upload">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <>
              <h3 className="text-sm font-bold">Add a photo of your book</h3>
              <span className="text-xs text-gray-500">
                You&apos;ll need one photo to get started. You can add more or make changes later.
              </span>
              <Dropzone className="flex flex-col gap-2 items-center p-4 mt-4" onUpload={field.onChange}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image size={32} />
                <span className="font-medium">Drag your photo here</span>
                <span className="text-xs underline font-semibold text-gray-800">Upload from your device</span>
              </Dropzone>
            </>
          )}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  )
}
