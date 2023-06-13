'use client'

import { ProfileMenu } from '@/app/_components/header/ProfileMenu'
import { Logo } from '@/components/Logo'
import { Anchor } from '@/components/ui/Anchor'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/NavigationMenu'
import Link from 'next/link'

export function LenderNavbar() {
  return (
    <div className="flex-row justify-between hidden md:flex">
      <Link href="/" className="cursor-pointer">
        <Logo />
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Anchor href="/lending/books">Books</Anchor>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Anchor href="/lending/reservations">Reservations</Anchor>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ProfileMenu />
    </div>
  )
}
