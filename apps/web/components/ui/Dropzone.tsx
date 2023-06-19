'use client'

import { Button } from '@/components/ui/Button'
import { ApiResponse } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DatabaseTypes } from 'database/client'
import { AlertCircle, Trash2 } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { Spinner } from './Spinner'
import { useToast } from './toast/use-toast'

export interface DropzoneProps {
  children?: React.ReactNode
  className?: string
  inputClassName?: string
  onUpload: (binaryStr: File) => void
}

const Dropzone = React.forwardRef<HTMLInputElement, DropzoneProps>(
  ({ className, inputClassName, children, onUpload, ...props }, ref) => {
    const [image, setImage] = React.useState<DatabaseTypes.Image>()
    const [loading, setLoading] = React.useState(false)
    const { toast } = useToast()

    const onDrop = React.useCallback<NonNullable<DropzoneOptions['onDrop']>>(
      async (acceptedFiles) => {
        setLoading(true)
        const uploadImage = async (file: File): Promise<DatabaseTypes.Image | undefined> => {
          const body = new FormData()
          body.append('file', file)
          const response = await fetch('/api/images', { method: 'POST', body })
          const apiResponse: ApiResponse<DatabaseTypes.Image> = await response.json()

          if ('errors' in apiResponse) {
            if ('errors' in apiResponse) {
              toast({
                title: apiResponse.errors[0]?.title,
                description: apiResponse.errors[0]?.detail,
              })
              return
            }
          }

          if (!response.ok) {
            toast({
              title: `There was a problem uploading you're image`,
              description: 'Please contact an administrator.',
            })
            return
          }
          return apiResponse.data
        }

        const [imageFile] = acceptedFiles
        if (!imageFile) return
        const img = await uploadImage(imageFile)
        setImage(img)
        setLoading(false)
      },
      [toast]
    )

    const deleteImage = async (imageId: string) => {
      setLoading(true)
      try {
        await fetch(`/api/images/${imageId}`, { method: 'DELETE' })
        setImage(undefined)
      } catch (error) {
        toast({
          title: `There was a problem deleting you're image`,
          description: 'Please contact an administrator.',
        })
      } finally {
        setLoading(false)
      }
    }

    const { getRootProps, getInputProps, fileRejections } = useDropzone({
      onDrop,
      accept: { 'image/jpeg': ['.jpeg', '.png'] },
      maxSize: 4000000,
      maxFiles: 1,
      disabled: loading || !!image,
    })

    const [fileRejection] = fileRejections
    const error = fileRejection?.errors[0]

    return (
      <>
        {image ? (
          <div className="h-40 bg-slate-50 flex justify-center relative">
            <Button
              variant="unstyled"
              className="absolute top-2 right-2 rounded-full bg-white shadow-sm h-8 w-8 p-1"
              onClick={() => deleteImage(image.id)}
              disabled={loading}
            >
              <Trash2 />
            </Button>
            <Image src={image.url} alt="Add Image" width={128} height={128} />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              'border border-gray-400 border-dashed h-32 flex justify-center items-center',
              className
            )}
          >
            <input className={cn('', inputClassName)} ref={ref} {...props} {...getInputProps()} />
            {loading ? <Spinner /> : children}
          </div>
        )}
        {error?.message && (
          <span className="text-red-700 flex gap-1 items-center">
            <AlertCircle className="[&>circle]:fill-red-700 [&>line]:stroke-white" /> {error?.message}
          </span>
        )}
      </>
    )
  }
)
Dropzone.displayName = 'Dropzone'

export { Dropzone }
