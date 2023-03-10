import { ModalProvider } from 'ui'
import { ReactNode } from 'react'
import { ApolloProvider } from './apollo'

interface IProvidersProps {
  children: ReactNode
}
export function Providers({ children }: IProvidersProps) {
  return (
    <ApolloProvider>
      <ModalProvider>{children}</ModalProvider>
    </ApolloProvider>
  )
}
