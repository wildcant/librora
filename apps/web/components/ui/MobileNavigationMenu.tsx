import { cn } from '@/lib/utils'
import { ChevronRight, LucideIcon } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import * as React from 'react'

const MobileNavigationMenu = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, children, ...props }, ref) => (
    <nav ref={ref} className={cn('', className)} {...props}>
      {children}
    </nav>
  )
)
MobileNavigationMenu.displayName = 'MobileNavigationMenu'

const MobileNavigationMenuList = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
  )
)
MobileNavigationMenuList.displayName = 'MobileNavigationMenuList'

type MobileNavigationItemProps = {
  icon: LucideIcon
  className?: string
  href: LinkProps['href']
  children: React.ReactNode
}
const MobileNavigationMenuItem = React.forwardRef<HTMLLIElement, MobileNavigationItemProps>(
  ({ className, icon: Icon, href, children, ...props }, ref) => (
    <li ref={ref} {...props}>
      <Link href={href} className={cn('flex flex-row justify-between w-full py-2', className)}>
        <div className="flex">
          <Icon className="mr-2" />
          <span className="text-sm">{children}</span>
        </div>
        <ChevronRight />
      </Link>
    </li>
  )
)
MobileNavigationMenuItem.displayName = 'MobileNavigationMenuItem'

export { MobileNavigationMenu, MobileNavigationMenuItem, MobileNavigationMenuList }
