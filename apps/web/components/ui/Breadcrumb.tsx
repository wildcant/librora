import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import { Children, cloneElement, ComponentPropsWithoutRef, isValidElement, ReactNode } from 'react'

export type BreadcrumbProps = ComponentPropsWithoutRef<'nav'>
function getValidChildren(children: React.ReactNode) {
  return Children.toArray(children).filter((child) => isValidElement(child)) as React.ReactElement[]
}

export function Breadcrumb({ children, className, ...props }: BreadcrumbProps) {
  const validChildren = getValidChildren(children)
  const count = validChildren.length

  const clones = validChildren.map((child, index) =>
    cloneElement(child, {
      isLastChild: count === index + 1,
    })
  )

  return (
    <nav className="my-1 mx-0" {...props}>
      <ol className={cn('flex list-none p-0 items-center flex-wrap', className)}>{clones}</ol>
    </nav>
  )
}

export type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'> & {
  isLastChild?: boolean
}
export function BreadcrumbItem({ children, className, isLastChild, ...props }: BreadcrumbItemProps) {
  return (
    <li className={cn('flex flex-row items-center text-xs sm:text-sm md:text-md', className)} {...props}>
      {children}
      {!isLastChild && <BreadcrumbSeparator />}
    </li>
  )
}

export type BreadcrumbLinkProps = LinkProps & {
  className?: string
  isLastChild?: boolean
  children: ReactNode
}
export function BreadcrumbLink({ className, children, ...props }: BreadcrumbLinkProps) {
  return (
    <Link className={cn('hover:underline', className)} {...props}>
      {children}
    </Link>
  )
}

export type BreadcrumbSeparatorProps = ComponentPropsWithoutRef<'span'> & {
  className?: string
}
export function BreadcrumbSeparator({ className, ...props }: BreadcrumbSeparatorProps) {
  return (
    <span className={cn('mx-1', className)} {...props}>
      <ChevronRight />
    </span>
  )
}
