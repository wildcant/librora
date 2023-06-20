import { ReactNode } from 'react'
import { BorrowerNavbar } from './_components/BorrowerNavbar'

type LenderLayoutProps = { children: ReactNode }
export default function LenderLayout({ children }: LenderLayoutProps) {
  return (
    <>
      <BorrowerNavbar />
      {children}
    </>
  )
}
