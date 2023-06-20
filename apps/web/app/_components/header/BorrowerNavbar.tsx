'use client'

import { ProfileMenu } from '@/app/_components/header/ProfileMenu'
import { Logo } from '@/components/Logo'
import { Anchor } from '@/components/ui/Anchor'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/NavigationMenu'
import { Separator } from '@/components/ui/Separator'
import Link from 'next/link'

export function BorrowerNavbar() {
  return (
    <>
      <div className="flex-row justify-between items-center hidden container md:flex h-16">
        <Link href="/" className="cursor-pointer">
          <Logo />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="hover:bg-gray-100">
              <Anchor href="/borrowing/reservations">Reservations</Anchor>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <ProfileMenu />
      </div>

      <Separator />
    </>
  )
}
