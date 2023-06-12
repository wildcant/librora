'use client'

import { Button } from '@/components/ui/Button'
import { signOut } from 'next-auth/react'

export function SignOut() {
  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
      Log out
    </Button>
  )
}
