'use client'

import { Button } from '@/components/ui/Button'
import { DialogFooter } from '@/components/ui/Dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { SignUpSchema, signUpSchema } from '@/lib/schemas/sign-up'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useLoginModal } from './modals/login'
import { useSignUpModal } from './modals/sign-up'

type SignUpFormProps = { isModal?: boolean }
export default function SignUpForm({ isModal }: SignUpFormProps) {
  const { open } = useLoginModal()
  const { close } = useSignUpModal()
  const router = useRouter()
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    /* Dev only. 
    defaultValues: {
      firstName: 'Willy',
      lastName: 'Wonka',
      email: 'testing.apps.wc@gmail.com',
      password: '12345',
    },
    /* */
  })

  function signUp(formData: SignUpSchema) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(signUp)}>
        <div>
          <div className="mb-4 grid grid-cols-2 gap-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormLabel>First name</FormLabel>
                  </FormItem>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormLabel>Last name</FormLabel>
                  </FormItem>
                  <FormMessage />
                </div>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <div className="mb-4">
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
              <div className="mb-4">
                <FormItem>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormLabel>Password</FormLabel>
                </FormItem>
                <FormMessage />
              </div>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" variant="default">
            Continue
          </Button>
        </DialogFooter>
      </form>

      {isModal && (
        <div className="mt-2 flex flex-row items-center justify-center text-neutral-900">
          <span className="text-xs">Already have an account?</span>{' '}
          <Button
            variant="link"
            className="ml-2 text-xs"
            type="button"
            onClick={() => {
              close()
              open()
            }}
          >
            Login
          </Button>
        </div>
      )}
    </Form>
  )
}
