'use client'

import clsx from 'clsx'
import { Book, LucideIcon, Menu, Search, UserCircle2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type TabScreenProps = { href: string; text: string; icon: LucideIcon }
/** Reference https://reactnavigation.org/docs/tab-based-navigation/ */
function TabScreen({ href, text, icon: Icon }: TabScreenProps) {
  const pathname = usePathname()
  return (
    <Link href={href} className="flex flex-col items-center text-neutral-500">
      <Icon
        className={clsx({
          'text-primary-400': pathname === href,
          'text-neutral-400': pathname !== href,
        })}
      />
      <span
        className={clsx('text-[10px] font-bold', {
          'text-neutral-800': pathname === href,
          'text-neutral-400': pathname !== href,
        })}
      >
        {text}
      </span>
    </Link>
  )
}

export function GeneralTabNavigator() {
  const session = useSession()
  return (
    <div className="fixed bottom-0 z-49 flex h-16 w-full justify-center border-t-[1px] border-t-neutral-100 bg-white md:hidden">
      <div className="flex h-full flex-row items-center gap-10">
        <TabScreen href="/" text="Explore" icon={Search} />
        {session.status === 'authenticated' ? (
          <TabScreen href="/account-settings" text="Profile" icon={UserCircle2} />
        ) : (
          <TabScreen href="/login" text="Sign in" icon={UserCircle2} />
        )}
      </div>
    </div>
  )
}

export function LenderTabNavigator() {
  const session = useSession()
  if (session.status !== 'authenticated') throw new Error('User must be authenticated')
  return (
    <div className="fixed bottom-0 z-49 flex h-16 w-full justify-center border-t-[1px] border-t-neutral-100 bg-white md:hidden">
      <div className="flex h-full flex-row items-center gap-10">
        <TabScreen href="/lending/books" text="Books" icon={Book} />
        <TabScreen href="/lending/menu" text="Menu" icon={Menu} />
      </div>
    </div>
  )
}
