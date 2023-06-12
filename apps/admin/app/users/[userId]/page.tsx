import { prisma } from 'database/server'
import { UserForm } from '../_components/UserForm'
import { UserNavigation } from '../_components/UserNavigation'

export default async function EditUser({ params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } })

  return (
    <>
      <UserNavigation currentPage="Edit" />

      {user ? (
        <article>
          <header>
            <h1>Edit User</h1>
          </header>
          <UserForm mode="edit" defaultValues={user} userId={params.userId} />
        </article>
      ) : (
        <div>User not found.</div>
      )}
    </>
  )
}
