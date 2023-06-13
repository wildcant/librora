import { ReactNode } from 'react'
import { LenderNavbar } from './_components/LenderNavbar'

type LenderLayoutProps = { children: ReactNode }
export default function LenderLayout({ children }: LenderLayoutProps) {
  return (
    <main>
      <LenderNavbar />
      {children}
    </main>
  )
}
