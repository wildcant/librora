'use client'

import { ModalProvider } from '@/components/Modal'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

type ProvidersProps = { session: Session | null; children: ReactNode }
export function Providers({ session, children }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ModalProvider>{children}</ModalProvider>
    </SessionProvider>
  )
}
