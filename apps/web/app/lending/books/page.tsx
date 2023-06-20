import { Anchor } from '@/components/ui/Anchor'
import { getCurrentUser } from '@/lib/get-current-user'
import { prisma } from 'database/server'
import { Plus, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { withTabNavigator } from '../../_components/withTabNavigator'
import { BooksTable } from './_components/BooksTable'

async function Books() {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const books = await prisma.book.findMany({ where: { owner: { id: user.id } }, include: { image: true } })

  return (
    <div className="container py-2">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">{books.length} Books</h1>
        <Link href="/lending/books/upload" className="p-0 md:hidden">
          <PlusCircle className="[&>circle]:stroke-black/50 [&>circle]:stroke-[1px]" size={32} />
        </Link>
        <Anchor
          href="/lending/books/upload"
          variant="button-outline"
          size="button-sm"
          className="md:flex md:flex-row md:gap-1 hidden"
        >
          <Plus />
          Add Book
        </Anchor>
      </div>

      <BooksTable books={books} className="mt-6" />
    </div>
  )
}

export default withTabNavigator(Books)('lender')
