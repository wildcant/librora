'use client'

import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import { Dropzone } from '@/components/ui/Dropzone'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Textarea } from '@/components/ui/TextArea'
import { useToast } from '@/components/ui/toast/use-toast'
import { BookSchema, bookSchema } from '@/lib/schemas/book'
import { zodResolver } from '@hookform/resolvers/zod'
import format from 'date-fns/format'
import { CalendarIcon, Image } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

export function BookUploadForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useForm<BookSchema>({
    resolver: zodResolver(bookSchema),
  })

  const saveBook: SubmitHandler<BookSchema> = async (formData) => {
    setLoading(true)
    const response = await fetch('/api/books', { method: 'post', body: JSON.stringify(formData) })
    const apiResponse = await response.json()
    if ('errors' in apiResponse) {
      toast({
        title: apiResponse.errors[0]?.title,
        description: apiResponse.errors[0]?.detail,
      })
      return
    }

    if (!response.ok) {
      toast({
        title: 'There was a problem',
        description: 'Please contact an administrator.',
      })
      return
    }

    router.replace('/lending/books')
    setLoading(false)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(saveBook)} className="flex flex-col gap-4" noValidate>
          <FormField
            control={form.control}
            name="image"
            render={({ field, fieldState }) => (
              <div>
                <h3 className="text-sm font-bold">Add a photo of your book</h3>
                <span className="text-xs text-gray-500">
                  You&apos;ll need one photo to get started. You can change it later.
                </span>
                <Dropzone
                  className="flex flex-col gap-2 items-center p-4 mt-4"
                  onUpload={(image) => field.onChange(image?.id)}
                  errorMessage={fieldState.error?.message}
                >
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image size={32} />
                  <span className="font-medium">Drag your photo here</span>
                  <span className="text-xs underline font-semibold text-gray-800">
                    Upload from your device
                  </span>
                </Dropzone>
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormLabel>Title</FormLabel>
                </FormItem>
                <FormMessage />
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormLabel>Description</FormLabel>
                </FormItem>
                <FormMessage />
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <div className="flex flex-col">
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="peer">
                        <Button
                          variant="unstyled"
                          className={`w-full text-sm font-normal pt-4 px-2 justify-start aria-[invalid="true"]:bg-red-50 align-top`}
                          data-valid={!!field.value ? 'true' : 'false'}
                        >
                          {field.value ? format(field.value, 'PPP') : <></>}
                          <CalendarIcon className="absolute h-4 w-4 opacity-50 top-1/2 -translate-y-1/2 right-2" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormLabel>Publication date</FormLabel>
                </FormItem>
                <FormMessage />
              </div>
            )}
          />

          <FormField
            control={form.control}
            name="numPages"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormLabel>Number of pages</FormLabel>
                </FormItem>
                <FormMessage />
              </div>
            )}
          />

          <Button type="submit" loading={loading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
