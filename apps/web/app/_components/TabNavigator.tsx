'use client'

import clsx from 'clsx'
import { LucideIcon, Search, UserCircle2 } from 'lucide-react'
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

export function TabNavigator() {
  return (
    <div className="fixed bottom-0 z-49 flex h-16 w-full justify-center border-t-[1px] border-t-neutral-100 bg-white md:hidden">
      <div className="flex h-full flex-row items-center gap-10">
        <TabScreen href="/" text="Explore" icon={Search} />
        <TabScreen href="/login" text="Sign in" icon={UserCircle2} />
      </div>
    </div>
  )
}
