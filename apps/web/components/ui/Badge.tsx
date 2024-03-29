import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        yellow: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80',
        emerald: 'border-transparent bg-emerald-500 text-white hover:bg-emerald-500/80',
        rose: 'border-transparent bg-rose-500 text-white hover:bg-rose-500/80',
        green: 'border-transparent bg-green-500 text-white hover:bg-green-500/80',
        amber: 'border-transparent bg-amber-500 text-white hover:bg-amber-500/80',
        red: 'border-transparent bg-red-500 text-white hover:bg-red-500/80',
        pink: 'border-transparent bg-pink-500 text-white hover:bg-pink-500/80',
        orange: 'border-transparent bg-orange-500 text-white hover:bg-orange-500/80',
        teal: 'border-transparent bg-teal-500 text-white hover:bg-teal-500/80',
        blue: 'border-transparent bg-blue-500 text-white hover:bg-blue-500/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn('bg-blue-500', badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
