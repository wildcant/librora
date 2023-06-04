import { env } from '@/lib/env'
import { FetchResourceResponse, SanitizedUser } from '@/lib/types'
import {} from 'next'
import { UserForm } from '../_components/UserForm'
import { UserNavigation } from '../_components/UserNavigation'

export default async function EditUser({ params }: { params: { userId: string } }) {
  const response: FetchResourceResponse<SanitizedUser> = await (
    await fetch(`${env.ADMIN_URL}/api/users/${params.userId}`)
  ).json()

  if ('errors' in response) {
    return <div>There was a problem loading the user</div>
  }

  return (
    <>
      <UserNavigation currentPage="Edit" />

      {response.data ? (
        <article>
          <header>
            <h1>Edit User</h1>
          </header>
          <UserForm mode="edit" defaultValues={response.data.attributes} />
        </article>
      ) : (
        <div>User not found.</div>
      )}
    </>
  )
}
