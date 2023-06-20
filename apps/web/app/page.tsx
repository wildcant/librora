import { Card, CardContent, CardProps } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { prisma } from 'database/server'
import { Book } from '@/lib/types'
import format from 'date-fns/format'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'
import { Pagination } from './_components/Pagination'
import { Header } from './_components/header/Header'
import { withTabNavigator } from './_components/withTabNavigator'
import { Suspense } from 'react'

type BookCardProps = CardProps & { book: Book; className?: string }
function BookCard({ book, className, ...props }: BookCardProps) {
  return (
    <Card className={cn('rounded-2xl', className)} {...props}>
      <Link href={`/book/${book.id}`}>
        <CardContent className="p-0">
          <div className="flex flex-col cursor-pointer h-full">
            {book.image && (
              <div className="w-[100%] h-44 lg:h-64 relative">
                <Image src={book.image.url} alt="book" fill className="object-cover rounded-2xl" />
              </div>
            )}

            <div className="p-1 flex flex-1 flex-col justify-between lg:p-2">
              <h1 className="text-sm font-semibold lg:text-md">{book.title}</h1>
              <h5 className="text-sm font-bold text-secondary-600">{format(new Date(book.date), 'yyyy')}</h5>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

const BOOK_LIST_PAGE_SIZE = 8
const searchBooksParamsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().optional(),
})
type SearchBooksParams = z.infer<typeof searchBooksParamsSchema>

function encodeSearch(search: string) {
  return search.split(' ').join('-')
}

function buildSearchQuery(params: SearchBooksParams): string {
  let query = '?'
  if (params.search) {
    query += `search=${encodeSearch(params.search)}`
  }

  /*
  if (params.dateRange) {
    query += `&startDate=${formatDate(params.dateRange.start)}&endDate=${formatDate(params.dateRange.end)}`
  }

  if (params.topics) {
    params.topics.forEach((topic) => {
      query += `&topics=${encodeURIComponent(topic)}`
    })
  }

  if (params.language) {
    query += `&language=${params.language}`
  }

  */

  return query
}

type BookListProps = { className?: string; params: SearchBooksParams }
async function BookList({ params, className }: BookListProps) {
  const { search, page = 1 } = params
  const pageIndex = page - 1
  const skip = pageIndex * BOOK_LIST_PAGE_SIZE
  // TODO: Use postgres text search.
  const query = { where: { title: { contains: search } } }
  const [books, count] = await Promise.all([
    prisma.book.findMany({ ...query, include: { image: true }, take: BOOK_LIST_PAGE_SIZE, skip }),
    prisma.book.count(query),
  ])
  const hasNextPage = skip + BOOK_LIST_PAGE_SIZE < count
  const hasPreviousPage = skip !== undefined && skip !== 0

  return (
    <div className={className}>
      <div className="md:grid sm:grid-cols-2 sm:gap-10 lg:grid lg:grid-cols-4 lg:gap-20">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <Pagination
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        nextPageUrl={`${buildSearchQuery(params)}&page=${page + 1}`}
        pageIndex={pageIndex}
        pageSize={BOOK_LIST_PAGE_SIZE}
        previousPageUrl={`${buildSearchQuery(params)}&page=${page - 1}`}
        totalCount={count}
      />
    </div>
  )
}

type HomePageProps = {
  searchParams?: { [key: string]: string | string[] | undefined }
}
async function HomePage({ searchParams }: HomePageProps) {
  return (
    <>
      <Header className="fixed w-full z-10 bg-white" />
      <Suspense fallback={<div>Loading..</div>}>
        {/* @ts-expect-error RSC */}
        <BookList className="pt-20 container" params={searchBooksParamsSchema.parse(searchParams)} />
      </Suspense>
    </>
  )
}

export default withTabNavigator(HomePage)('general')
