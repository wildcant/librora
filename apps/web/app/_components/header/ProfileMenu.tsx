'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import { Separator } from '@/components/ui/Separator'
import { PopoverContent } from '@radix-ui/react-popover'
import { UserCircle2 } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useLoginModal } from '../modals/login'
import { useSignUpModal } from '../modals/sign-up'

export function ProfileMenu() {
  const { open: openLogin } = useLoginModal()
  const { open: openSignUp } = useSignUpModal()
  const session = useSession()
  return (
    <Popover>
      <PopoverTrigger className="data-[state=open]:shadow-md rounded-full">
        {session.status === 'authenticated' ? (
          <Avatar>
            <AvatarImage src={session.data.user?.image ?? ''} alt="profile-image" />
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
      <PopoverContent className="w-60 bg-white rounded-2xl shadow-md py-4 border" align="end" sideOffset={10}>
        <div className="flex flex-col">
          {session.status === 'authenticated' ? (
            <>
              <Link
                href="/account-settings"
                className="justify-start pl-8 py-2 hover:bg-accent hover:text-accent-foreground"
              >
                Account
              </Link>
              <Link
                href="/lending/books"
                className="justify-start pl-8 py-2 hover:bg-accent hover:text-accent-foreground"
              >
                Manage your Books
              </Link>
              <Separator className="my-1" />
              <Button variant="ghost" className="justify-start pl-8" onClick={() => signOut()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="justify-start pl-8" onClick={openLogin}>
                Log in
              </Button>
              <Button variant="ghost" className="justify-start pl-8" onClick={openSignUp}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
