import { UserNavigation } from '../_components/UserNavigation'
import { UserForm } from '../_components/UserForm'

export default function NewUser() {
  return (
    <>
      <UserNavigation currentPage="New" />
      <article>
        <header>
          <h1>New User</h1>
        </header>

        <UserForm mode="create" />
      </article>
    </>
  )
}
