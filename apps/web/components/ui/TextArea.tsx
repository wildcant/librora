import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        `peer placeholder-transparent pt-4 px-2 pb-1 w-full rounded-md focus:outline-none text-base align-top
        border-t-[18px] border-transparent
        disabled:opacity-0 disabled:cursor-not-allowed 
        aria-[invalid="true"]:bg-red-50 aria-[invalid="true"]:focus:bg-transparent`,
        className
      )}
      ref={ref}
      placeholder="textarea"
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
