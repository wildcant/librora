'use client'

import { Button } from '@/components/ui/Button'
import { DialogFooter } from '@/components/ui/Dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { ApiResponse } from '@/lib/api/types'
import { ForgotPasswordData, forgotPasswordSchema } from '@/lib/schemas/forgot-password'
import { SanitizedUser } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    /* Dev only.
      defaultValues: {
        email: 'joe@mail.com',
        password: '12345',
      },
    */
  })

  async function forgotPassword(values: ForgotPasswordData) {
    const response: ApiResponse<SanitizedUser, { token: string; expires: number }> = await (
      await fetch('/api/auth/forgot-password', { method: 'post', body: JSON.stringify(values) })
    ).json()

    if ('errors' in response) {
      // TODO: Handle errors
      return
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(forgotPassword)}>
        <div className="grid gap-4 py-4">
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
        </div>

        <DialogFooter>
          <Button type="submit" variant="default">
            Send Reset Instructions
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
