import Link from 'next/link'

export function UserNavigation({ currentPage }: { currentPage: string }) {
  return (
    <nav aria-label="breadcrumb">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/users">Users</Link>
        </li>
        <li>{currentPage}</li>
      </ul>
    </nav>
  )
}
