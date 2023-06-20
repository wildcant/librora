import {
  MobileNavigationMenu,
  MobileNavigationMenuItem,
  MobileNavigationMenuList,
} from '@/components/ui/MobileNavigationMenu'
import { Separator } from '@/components/ui/Separator'
import { getCurrentUser } from '@/lib/get-current-user'
import { Book, Fingerprint, UserCircle } from 'lucide-react'
import { SignOutButton } from '@/app/_components/SignOutButton'
import { withTabNavigator } from '@/app/_components/withTabNavigator'
import Link from 'next/link'

async function AccountSettings() {
  const user = await getCurrentUser()

  return (
    <main className="container pt-4">
      <MobileNavigationMenu className="md:hidden">
        <h1 className="font-bold text-lg">Profile</h1>

        <MobileNavigationMenuList>
          <MobileNavigationMenuItem href="/personal-info" icon={UserCircle}>
            Personal info
          </MobileNavigationMenuItem>
        </MobileNavigationMenuList>

        <Separator className="my-4" />

        <h3 className="font-bold text-md">Lending</h3>
        <MobileNavigationMenuList>
          <MobileNavigationMenuItem href="/lending/books" icon={Book}>
            Manage your Books
          </MobileNavigationMenuItem>
        </MobileNavigationMenuList>

        <Separator className="my-4" />

        <div>
          <SignOutButton />
        </div>
      </MobileNavigationMenu>
      <div className="hidden md:block">
        <h3 className="text-lg font-bold">Account</h3>
        <div>
          <span className="text-sm font-bold">
            {user?.firstName} {user?.lastName},
          </span>{' '}
          {user?.email}
        </div>

        <div className="grid grid-cols-4">
          <Link href="/personal-info">
            <div className="rounded-2xl p-8 flex flex-col shadow-md">
              <Fingerprint />
              <h3 className="text-sm font-bold">Personal Info</h3>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default withTabNavigator(AccountSettings)('general')
