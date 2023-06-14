import { Toaster } from '@/components/ui/Toaster'
import { Merienda, Plus_Jakarta_Sans, Roboto_Slab } from '@next/font/google'
import { getServerSession } from 'next-auth'
import { Providers } from './Providers'
import './globals.css'

const merienda = Merienda({ subsets: ['latin'], variable: '--font-merienda' })

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto-slab',
  style: ['normal'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${merienda.variable} ${robotoSlab.variable} ${plusJakartaSans.variable}`}>
      <body>
        <Providers session={await getServerSession()}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
