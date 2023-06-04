import { FetchResourcesResponse, SanitizedUser } from '@/lib/types'
import Link from 'next/link'
import { DeleteUserButton } from './components/DeleteUserButton'
import { env } from '@/lib/env'

export default async function Users() {
  const response: FetchResourcesResponse<SanitizedUser> = await (
    await fetch(`${env.ADMIN_URL}/api/users`)
  ).json()

  if ('errors' in response) {
    return <div>There was a problem loading the users</div>
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>Users</li>
        </ul>
      </nav>

      <br />

      <header>
        <div className="row middle-xs between-xs">
          <h1>Users</h1>
          <Link href="/users/new" role="button">
            New
          </Link>
        </div>
      </header>

      <br />

      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {response.data.map((user) => (
            <tr key={user.id}>
              <td>
                {user.attributes.firstName} {user.attributes.lastName}
              </td>
              <td>{user.attributes.email}</td>
              <td>
                <div className="row end-xs" style={{ gap: 6 }}>
                  <Link className="icon-button text-yellow" href={`/users/${user.id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M15.7279 9.57629L14.3137 8.16207L5 17.4758V18.89H6.41421L15.7279 9.57629ZM17.1421 8.16207L18.5563 6.74786L17.1421 5.33365L15.7279 6.74786L17.1421 8.16207ZM7.24264 20.89H3V16.6474L16.435 3.21233C16.8256 2.8218 17.4587 2.8218 17.8492 3.21233L20.6777 6.04075C21.0682 6.43128 21.0682 7.06444 20.6777 7.45497L7.24264 20.89Z"
                      />
                    </svg>
                  </Link>
                  <DeleteUserButton userId={user.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
