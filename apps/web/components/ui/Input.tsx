import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'peer placeholder-transparent pt-4 px-2 pb-1 w-full rounded-md focus:outline-none text-base disabled:opacity-0 disabled:cursor-not-allowed aria-[invalid="true"]:bg-red-50 aria-[invalid="true"]:focus:bg-transparent',
        className
      )}
      ref={ref}
      autoComplete="off"
      placeholder="input"
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
