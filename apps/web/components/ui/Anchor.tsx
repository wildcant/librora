import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Link, { LinkProps } from 'next/link'

const anchorVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: '',
        'button-default': 'bg-primary text-primary-foreground hover:bg-primary/90',
        'button-destructive': 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        'button-outline': 'border border-input hover:bg-accent hover:text-accent-foreground',
        'button-secondary': 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'button-ghost': 'hover:bg-accent hover:text-accent-foreground',
        'button-link': 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: '',
        'button-default': 'text-sm h-10 py-2 px-4',
        'button-sm': 'text-xs h-9 px-3 rounded-md',
        'button-lg': 'text-md h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface anchorProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof anchorVariants>,
    Pick<LinkProps, 'href'> {
  loading?: boolean
}

const Anchor = React.forwardRef<HTMLAnchorElement, anchorProps>(
  ({ className, variant, size, children, loading, href, ...props }, ref) => {
    return (
      <Link
        className={cn(anchorVariants({ variant, size, className }))}
        ref={ref}
        aria-disabled={loading}
        href={href}
        {...props}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <></>}
        {children}
      </Link>
    )
  }
)
Anchor.displayName = 'anchor'

export { Anchor, anchorVariants }
