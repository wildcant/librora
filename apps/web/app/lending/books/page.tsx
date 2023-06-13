import { prisma } from 'database/server'
import { getServerSession } from 'next-auth'
import { withTabNavigator } from '../../_components/withTabNavigator'

async function Books() {
  const session = await getServerSession()
  if (!session?.user) throw new Error('User not authenticated')
  const books = await prisma.book.findMany({ where: { owner: { id: session.user.id } } })
  return (
    <>
      <h1 className="text-lg font-bold">Listings</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            - <span className="text-sm">{book.title}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default withTabNavigator(Books)('lender')
