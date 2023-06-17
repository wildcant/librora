import { withTabNavigator } from '@/app/_components/withTabNavigator'
import { Anchor } from '@/components/ui/Anchor'
import {
  MobileNavigationMenu,
  MobileNavigationMenuItem,
  MobileNavigationMenuList,
} from '@/components/ui/MobileNavigationMenu'
import { Separator } from '@/components/ui/Separator'
import { Book, Luggage } from 'lucide-react'
import { SignOutButton } from '../../_components/SignOutButton'

function LenderMenu() {
  return (
    <main>
      <MobileNavigationMenu className="pt-4 container">
        <h1 className="font-bold text-lg">Menu</h1>

        <Separator className="my-4" />

        <h3 className="font-bold text-md">Lending</h3>
        <MobileNavigationMenuList>
          <MobileNavigationMenuItem href="/lending/books" icon={Book}>
            Manage your Books
          </MobileNavigationMenuItem>
          <MobileNavigationMenuItem href="/lending/reservations" icon={Luggage}>
            Reservations
          </MobileNavigationMenuItem>
        </MobileNavigationMenuList>

        <Separator className="my-4" />

        <div className="flex flex-col gap-2">
          <Anchor href="/" variant="button-outline" size="button-default">
            Switch to borrowing
          </Anchor>
          <SignOutButton />
        </div>
      </MobileNavigationMenu>
    </main>
  )
}

export default withTabNavigator(LenderMenu)('lender')
