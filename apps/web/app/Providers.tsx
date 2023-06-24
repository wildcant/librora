'use client'

import { ModalProvider } from '@/components/Modal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

type ProvidersProps = { session: Session | null; children: ReactNode }
export function Providers({ session, children }: ProvidersProps) {
  const queryClient = new QueryClient()

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>{children}</ModalProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
