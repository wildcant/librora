'use client'

import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Separator } from '@/components/ui/Separator'
import { LocationSchema, locationSchema } from '@/lib/schemas/location'
import { NameSchema, nameSchema } from '@/lib/schemas/name'
import { IUserSchema } from '@/lib/schemas/user'
import { ApiResponse, SanitizedUser } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Country, countries } from 'database/client'
import { useSession } from 'next-auth/react'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'

async function updateUser(
  userId: string,
  userData: Partial<IUserSchema>
): Promise<ApiResponse<SanitizedUser> | undefined> {
  try {
    const response: ApiResponse<SanitizedUser> = await (
      await fetch(`/api/users/${userId}`, { method: 'PATCH', body: JSON.stringify(userData) })
    ).json()

    if ('errors' in response) {
      // Handle errors
      return
    }

    return response
  } catch (error) {
    console.error(`TODO: Handle error. Unexpected error updating user. ${error}`)
    return
  }
}

type NameFormProps = { handleClose: () => void }
function NameForm({ handleClose }: NameFormProps) {
  const session = useSession()
  const [loading, setLoading] = useState(false)
  const { user } = session.data ?? {}
  const form = useForm<NameSchema>({
    resolver: zodResolver(nameSchema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName },
  })

  const saveName = async (formData: NameSchema) => {
    setLoading(true)
    if (!user?.id) {
      console.log('TODO: Handle unexpected error in name form.')
      setLoading(false)
      return
    }
    await updateUser(user.id, formData)
    await session.update({ user: formData })
    setLoading(false)
    handleClose()
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <span>Name</span>
        <Button variant="link" className="text-black p-0 h-auto" underline onClick={handleClose}>
          Cancel
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(saveName)}>
          <div className="grid gap-4 py-4">
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

          <Button type="submit" variant="default" loading={loading}>
            Save
          </Button>
        </form>
      </Form>
    </>
  )
}

type ProfileFieldProps = { label: string; onClickEdit: () => void; children: ReactNode }
function ProfileField({ label, onClickEdit, children }: ProfileFieldProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <Button variant="link" className="text-black p-0 h-auto" underline onClick={onClickEdit}>
          Edit
        </Button>
      </div>
      <span className="text-sm text-gray-500">{children}</span>
      <Separator className="my-4" />
    </div>
  )
}

type AddressFormProps = { handleClose: () => void }
function AddressForm({ handleClose }: AddressFormProps) {
  const session = useSession()
  const [loading, setLoading] = useState(false)
  const { user } = session.data ?? {}
  const form = useForm<LocationSchema>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      city: user?.location?.city,
      country: user?.location?.country,
      zipcode: user?.location?.zipcode,
    },
  })

  const saveAddress = async (formData: LocationSchema) => {
    setLoading(true)
    if (!user?.id) {
      console.log('TODO: Handle unexpected error in name form.')
      setLoading(false)
      return
    }
    await updateUser(user.id, { location: formData })
    await session.update({ user: { location: formData } })
    setLoading(false)
    handleClose()
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <span>Name</span>
        <Button variant="link" className="text-black p-0 h-auto" underline onClick={handleClose}>
          Cancel
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(saveAddress)}>
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <div>
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-40">
                      {Object.values(Country).map((country) => (
                        <SelectItem key={country} value={country}>
                          {countries[country].country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormMessage />
              </div>
            )}
          />

          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormLabel>City</FormLabel>
                  </FormItem>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <div>
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormLabel>Zipcode</FormLabel>
                  </FormItem>
                  <FormMessage />
                </div>
              )}
            />
          </div>

          <Button type="submit" variant="default" loading={loading}>
            Save
          </Button>
        </form>
      </Form>
    </>
  )
}

export function PersonalInfo() {
  const session = useSession()
  const [showNameForm, setShowNameForm] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  if (!session.data?.user) throw new Error('Unauthenticated user.')
  const { user } = session.data

  const formattedLocation = () => {
    if (!user?.location) return 'Not provided'
    const { country, city, zipcode } = user.location
    return `${country}, ${city}, ${zipcode}`
  }

  return (
    <div>
      {showNameForm ? (
        <NameForm handleClose={() => setShowNameForm(false)} />
      ) : (
        <ProfileField label="Name" onClickEdit={() => setShowNameForm(true)}>
          {user.firstName} {user.lastName}
        </ProfileField>
      )}

      {showAddressForm ? (
        <AddressForm handleClose={() => setShowAddressForm(false)} />
      ) : (
        <ProfileField label="Address" onClickEdit={() => setShowAddressForm(true)}>
          {formattedLocation()}
        </ProfileField>
      )}
    </div>
  )
}
