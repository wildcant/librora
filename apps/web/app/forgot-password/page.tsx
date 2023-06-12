import { ForgotPasswordForm } from '../_components/ForgotPasswordForm'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

export default function ForgotPassword() {
  let success = false
  if (success) {
    return (
      <>
        <p className="mb-6 text-xl">Forgot Password</p>
        <p className="mb-8 text-sm">
          If we found an eligible account associated with that username, we&apos;ve sent password reset
          instructions to the primary email address on the account.
        </p>

        <div className="mt-2 text-neutral-900">
          <span className="text-xs">Don&apos;t have a Librora account?</span>{' '}
          <Link href="sign-up" className="ml-2">
            Sign Up
          </Link>
        </div>
      </>
    )
  }

  return (
    <main className="px-4 py-6">
      <Logo />
      <p className="mb-6 text-xl">Forgot Password?</p>
      <p className="mb-8 text-sm">
        Enter the email address you used when you joined and we&apos;ll send you instructions to reset your
        password.
      </p>
      <ForgotPasswordForm />

      <div className="mt-2 flex flex-row items-center justify-center text-neutral-900">
        <span className="text-xs">Not a member?</span>{' '}
        <Link href="sign-up" className="ml-2 text-xs">
          Sign Up
        </Link>
      </div>
    </main>
  )
}
