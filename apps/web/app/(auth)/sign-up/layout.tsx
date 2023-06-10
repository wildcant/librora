import { Logo } from '@/components/Logo'
import Link from 'next/link'

export default function AuthRegistrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="flex items-center justify-center py-2">
        <span className="font-bold text-xs">Sign up</span>
      </div>
      <hr />
      <section className="px-4 py-6">
        <div className="flex items-center gap-1 mb-4">
          <h1 className="font-bold">Welcome to </h1>
          <Logo />
        </div>
        {children}
        <div className="mt-2 flex flex-row items-center justify-center text-neutral-900">
          <span className="text-xs">Already have an account?</span>{' '}
          <Link href="login" className="ml-2 text-xs">
            Login
          </Link>
        </div>
      </section>
    </main>
  )
}
