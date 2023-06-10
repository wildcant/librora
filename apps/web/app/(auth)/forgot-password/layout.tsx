import { Logo } from '@/components/Logo'

export default function AuthResetLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-4 py-6">
      <Logo />
      {children}
    </main>
  )
}
