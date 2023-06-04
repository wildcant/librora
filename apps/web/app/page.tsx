import { fetchUsers } from 'lib/users'

export default async function IndexPage() {
  const users = await fetchUsers()

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  )
}
