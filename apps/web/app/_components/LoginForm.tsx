'use client'

import { Button } from '@/components/ui/Button'
import { DialogFooter } from '@/components/ui/Dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { LoginSchema, loginSchema } from '@/lib/schemas/login'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useForgotPasswordModal } from './modals/forgot-password'
import { useLoginModal } from './modals/login'
import { useSignUpModal } from './modals/sign-up'
import { useToast } from '@/components/ui/toast/use-toast'

type LoginFormProps = { isModal?: boolean }

export function LoginForm({ isModal }: LoginFormProps) {
  const router = useRouter()
  const signUpModal = useSignUpModal()
  const loginModal = useLoginModal()
  const forgotPasswordModal = useForgotPasswordModal()
  const { status } = useSession()
  const { toast } = useToast()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    /* Dev only. */
    // defaultValues: {
    //   email: 'joe@mail.com',
    //   password: '12345',
    // },
    /* */
  })

  async function login(values: LoginSchema) {
    try {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (response?.error) {
        toast({
          title: `There was a problem login in`,
          description: response.error,
        })
        return
      }

      if (response?.ok) {
        if (isModal) {
          loginModal.close()
          router.refresh()
        } else {
          router.replace('/')
        }
        return
      }
      throw new Error('Unexpected response from sign in.')
    } catch (error) {
      // TODO: Handle error.
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(login)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormLabel>Email</FormLabel>
                </FormItem>
                <FormMessage />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormLabel>Password</FormLabel>
                </FormItem>
                <FormMessage />
                <div className="flex justify-end mt-2">
                  {isModal ? (
                    <Button
                      variant="link"
                      className="p-0 m-0 text-xs"
                      type="button"
                      onClick={() => {
                        loginModal.close()
                        forgotPasswordModal.open()
                      }}
                    >
                      Forgot password?
                    </Button>
                  ) : (
                    <Link href="/forgot-password" className="text-xs">
                      Forgot password?
                    </Link>
                  )}
                </div>
              </div>
            )}
          />
        </div>

        <DialogFooter className="mt-6">
          <Button type="submit" variant="default" loading={status === 'loading'}>
            Continue
          </Button>
        </DialogFooter>
      </form>

      {isModal && (
        <div className="mt-2 flex flex-row items-center justify-center text-neutral-900">
          <span className="text-xs">Don&apos;t have an account yet?</span>{' '}
          <Button
            variant="link"
            type="button"
            className="ml-2 text-xs"
            onClick={() => {
              loginModal.close()
              signUpModal.open()
            }}
          >
            Sign up
          </Button>
        </div>
      )}
    </Form>
  )
}
