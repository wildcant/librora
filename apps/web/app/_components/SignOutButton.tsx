'use client'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

type SignOutButtonProps = { className?: string }
export function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: '/' })}
      className={cn('w-full', className)}
    >
      Log out
    </Button>
  )
}
