'use client'

import { userSchema, type IUserSchema } from '@/lib/schemas/user'
import { ApiResponse, ResponseError, SanitizedUser } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role, Status, Type } from 'database/client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DefaultValues, useForm } from 'react-hook-form'

type UserFormProps = { mode: 'create' } | { mode: 'edit'; defaultValues: SanitizedUser; userId: string }
export function UserForm(props: UserFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<ResponseError>([])

  let defaultValues: DefaultValues<IUserSchema> = {}
  if (props.mode === 'create') {
    defaultValues = {
      status: 'PENDING',
      type: 'USER',
      role: 'LENDER_BORROWER_USER',
    }
  } else if (props.mode === 'edit') {
    defaultValues = {
      status: props.defaultValues.status,
      type: props.defaultValues.type,
      role: props.defaultValues.role,
      firstName: props.defaultValues.firstName,
      lastName: props.defaultValues.lastName,
      email: props.defaultValues.email,
      password: props.defaultValues.password ?? '',
    }
  }

  const { handleSubmit, formState, register, watch, setValue } = useForm<IUserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  async function createUser(userData: IUserSchema) {
    setSubmitting(true)
    try {
      const response: ApiResponse<SanitizedUser> = await (
        await fetch('/api/users', { method: 'post', body: JSON.stringify(userData) })
      ).json()
      if ('errors' in response) {
        setErrors(response.errors)
        return
      }

      router.replace('/users')
    } catch (error) {
      console.error(`TODO: Handle error. Unexpected error creating user. ${error}`)
    } finally {
      setSubmitting(false)
    }
  }

  async function updateUser(userData: IUserSchema, id: string) {
    setSubmitting(true)
    try {
      const response: ApiResponse<SanitizedUser> = await (
        await fetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(userData) })
      ).json()

      if ('errors' in response) {
        setErrors(response.errors)
        return
      }
      router.replace('/users')
    } catch (error) {
      console.error(`TODO: Handle error. Unexpected error updating user. ${error}`)
    } finally {
      setSubmitting(false)
    }
  }

  async function submit(userData: IUserSchema) {
    if (props.mode === 'create') {
      createUser(userData)
    } else if (props.mode === 'edit') {
      updateUser(userData, props.userId)
    } else {
      throw new Error(`Invalid form mode. `)
    }
  }

  // Dynamically update user role based on user type.
  const type = watch('type')
  useEffect(() => {
    if (type === 'ADMIN') {
      setValue('role', Role.SUPER_ADMIN)
    } else if (type === 'USER') {
      setValue('role', Role.LENDER_BORROWER_USER)
    }
  }, [type, setValue])

  let submitLabel = 'Submit'
  if (props.mode === 'create') {
    submitLabel = 'Create'
  } else if (props.mode === 'edit') {
    submitLabel = 'Update'
  }
  return (
    <>
      {errors.length ? (
        <div className="alert alert-danger form-errors">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style={{ width: 24, height: 24, fill: '#c99724' }}
            >
              <path d="M4.00098 20V14C4.00098 9.58172 7.5827 6 12.001 6C16.4193 6 20.001 9.58172 20.001 14V20H21.001V22H3.00098V20H4.00098ZM6.00098 14H8.00098C8.00098 11.7909 9.79184 10 12.001 10V8C8.68727 8 6.00098 10.6863 6.00098 14ZM11.001 2H13.001V5H11.001V2ZM19.7792 4.80761L21.1934 6.22183L19.0721 8.34315L17.6578 6.92893L19.7792 4.80761ZM2.80859 6.22183L4.22281 4.80761L6.34413 6.92893L4.92991 8.34315L2.80859 6.22183Z"></path>
            </svg>
            <p>
              There was a problem trying to process you&apos;re request. <br /> Please review the following
              errors:
            </p>
          </div>
          <ul style={{ marginBottom: 0 }}>
            {errors.map((error) => (
              <li key={error.detail}>{error.detail}</li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}

      <form onSubmit={handleSubmit(submit)}>
        <fieldset>
          <legend>Status</legend>
          <label htmlFor={Status.ACTIVE}>
            <input type="radio" id={Status.ACTIVE} value={Status.ACTIVE} {...register('status')} />
            Active
          </label>
          <label htmlFor={Status.PENDING}>
            <input type="radio" id={Status.PENDING} value={Status.PENDING} {...register('status')} />
            Pending
          </label>
        </fieldset>

        <label>
          First Name
          <input
            type="text"
            aria-invalid={formState.errors?.firstName ? 'true' : undefined}
            {...register('firstName')}
          />
          {formState.errors.firstName ? (
            <small className="text-red">{formState.errors.firstName.message}</small>
          ) : (
            <></>
          )}
        </label>

        <label>
          Last Name
          <input
            type="text"
            aria-invalid={formState.errors?.lastName ? 'true' : undefined}
            {...register('lastName')}
          />
          {formState.errors.lastName ? (
            <small className="text-red">{formState.errors.lastName.message}</small>
          ) : (
            <></>
          )}
        </label>

        <fieldset>
          <legend>Type</legend>
          <label htmlFor={Type.ADMIN}>
            <input type="radio" id={Type.ADMIN} value={Type.ADMIN} {...register('type')} />
            Admin
          </label>
          <label htmlFor={Type.USER}>
            <input type="radio" id={Type.USER} value={Type.USER} {...register('type')} />
            User
          </label>
        </fieldset>

        <label>
          Email
          <input
            type="email"
            aria-invalid={formState.errors?.email ? 'true' : undefined}
            {...register('email')}
          />
          {formState.errors.email ? (
            <small className="text-red">{formState.errors.email.message}</small>
          ) : (
            <></>
          )}
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="*****"
            aria-invalid={formState.errors?.password ? 'true' : undefined}
            {...register('password')}
          />
          {formState.errors.password ? (
            <small className="text-red">{formState.errors.password.message}</small>
          ) : (
            <></>
          )}
        </label>

        <button type="submit" aria-busy={submitting} disabled={submitting}>
          {submitLabel}
        </button>
      </form>
    </>
  )
}
