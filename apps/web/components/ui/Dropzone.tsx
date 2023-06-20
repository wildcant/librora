'use client'

import { Button } from '@/components/ui/Button'
import { ApiResponse } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DatabaseTypes } from 'database/client'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { Spinner } from './Spinner'
import { useToast } from './toast/use-toast'

export interface DropzoneProps {
  children?: React.ReactNode
  className?: string
  inputClassName?: string
  onUpload: (image?: DatabaseTypes.Image) => void
  errorMessage?: string
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, inputClassName, children, onUpload, errorMessage, ...props }, ref) => {
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

          if (!response.ok || !apiResponse.data) {
            toast({
              title: `There was a problem uploading you're image`,
              description: 'Please contact an administrator.',
            })
            return
          }
          return apiResponse.data
        }

        const [imageFile] = acceptedFiles
        if (!imageFile) {
          setLoading(false)
          return
        }
        const img = await uploadImage(imageFile)
        setImage(img)
        onUpload(img)
        setLoading(false)
      },
      [toast, onUpload]
    )

    const deleteImage = async (imageId: string) => {
      setLoading(true)
      try {
        await fetch(`/api/images/${imageId}`, { method: 'DELETE' })
        setImage(undefined)
        onUpload(undefined)
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
      accept: { 'image/jpeg': ['.jpeg', '.png', '.webp'] },
      maxSize: 2000000,
      maxFiles: 1,
      disabled: loading || !!image,
    })

    const [fileRejection] = fileRejections
    const fileErrorMessage = fileRejection?.errors[0]?.message

    return (
      <div ref={ref}>
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
            <Image src={image.url} alt="Add Image" width={128} height={128} className="object-cover" />
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              'border border-gray-400 border-dashed h-32 flex justify-center items-center',
              className
            )}
          >
            <input className={cn('', inputClassName)} {...props} {...getInputProps()} />
            {loading ? <Spinner /> : children}
          </div>
        )}
        {(errorMessage || fileErrorMessage) && (
          <p className={cn('text-xs font-medium text-red-600 flex mt-1')}>
            <svg className="w-4 h-4 fill-red-700" viewBox="0 0 24 24">
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>
            </svg>

            {errorMessage || fileErrorMessage}
          </p>
        )}
      </div>
    )
  }
)
Dropzone.displayName = 'Dropzone'

export { Dropzone }
