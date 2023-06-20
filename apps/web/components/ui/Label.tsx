'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const labelVariants = cva(
  `font-light leading-none absolute transition-all left-2 
  text-xs peer-focus:text-xs peer-placeholder-shown:text-sm peer-data-[valid=false]:text-sm
  -translate-y-1/2 top-2 peer-focus:top-2 peer-placeholder-shown:top-1/2 peer-data-[state=open]:top-2 peer-data-[valid=false]:top-1/2 
  peer-disabled:cursor-not-allowed peer-disabled:opacity-70`
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className, '')} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
