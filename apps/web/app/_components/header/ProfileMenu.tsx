'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import { Separator } from '@/components/ui/Separator'
import { PopoverContent } from '@radix-ui/react-popover'
import { UserCircle2 } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLoginModal } from '../modals/login'
import { useSignUpModal } from '../modals/sign-up'

export function ProfileMenu() {
  const { open: openLogin } = useLoginModal()
  const { open: openSignUp } = useSignUpModal()
  const session = useSession()
  const pathname = usePathname()
  const isLending = pathname.includes('lending')

  return (
    <Popover>
      <PopoverTrigger
        className="rounded-full h-8 w-8 border flex justify-center items-center data-[state=open]:shadow-md"
        aria-label="avatar-dialog-trigger"
      >
        {session.status === 'authenticated' ? (
          <Avatar>
            {/* TODO: Add user image to account settings. */}
            <AvatarImage src={/* session.data.user?.image ?? */ ''} alt="profile-image" />
            <AvatarFallback className="bg-gray-800 text-white">
              {session.data.user?.firstName?.charAt(0)}
              {session.data.user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar>
            <AvatarFallback className="bg-transparent">
              <UserCircle2 size={32} />
            </AvatarFallback>
          </Avatar>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-48 bg-white rounded-2xl shadow-md py-2 border z-50"
        align="end"
        sideOffset={10}
      >
        <div className="flex flex-col">
          {session.status === 'authenticated' ? (
            <>
              <Link
                href="/account-settings"
                className="justify-start pl-4 py-2 hover:bg-accent hover:text-accent-foreground text-xs"
              >
                Account
              </Link>
              <Link
                href={`${isLending ? '/lending' : ''}/reservations`}
                className="justify-start pl-4 py-2 hover:bg-accent hover:text-accent-foreground text-xs"
              >
                Reservations
              </Link>
              <Link
                href="/lending/books"
                className="justify-start pl-4 py-2 hover:bg-accent hover:text-accent-foreground text-xs"
              >
                Manage your Books
              </Link>
              <Separator className="my-1" />
              {isLending ? (
                <Link
                  href="/"
                  className="justify-start pl-4 py-2 hover:bg-accent hover:text-accent-foreground text-xs"
                >
                  Switch to borrowing
                </Link>
              ) : (
                <></>
              )}
              <Button variant="ghost" className="justify-start pl-4 text-xs" onClick={() => signOut()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="justify-start pl-4 text-xs" onClick={openLogin}>
                Log in
              </Button>
              <Button variant="ghost" className="justify-start pl-4 text-xs" onClick={openSignUp}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
