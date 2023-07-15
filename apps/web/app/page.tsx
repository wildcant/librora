import { prisma } from 'database/server'
import { Suspense } from 'react'
import { z } from 'zod'
import { Pagination } from './_components/Pagination'
import { Header } from './_components/header/Header'
import { withTabNavigator } from './_components/withTabNavigator'
import { BookCard } from './_components/BookCard'

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
    prisma.book.findMany({
      ...query,
      include: { image: true },
      take: BOOK_LIST_PAGE_SIZE,
      skip,
      orderBy: { title: 'desc' },
    }),
    prisma.book.count(query),
  ])
  const hasNextPage = skip + BOOK_LIST_PAGE_SIZE < count
  const hasPreviousPage = skip !== undefined && skip !== 0

  return (
    <div className={className}>
      <div className="md:grid sm:grid-cols-2 sm:gap-10 lg:grid lg:grid-cols-4 lg:gap-6">
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
