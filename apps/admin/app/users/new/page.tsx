import { UserNavigation } from '../components/UserNavigation'
import { UserForm } from '../components/UserForm'

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
