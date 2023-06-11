import { Icon } from '@/components/icon'
import Link from 'next/link'

type PaginationProps = {
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  nextPageUrl: string
  pageIndex: number
  pageSize: number
  previousPageUrl: string
  totalCount: number
}

export function Pagination({
  hasNextPage,
  hasPreviousPage,
  nextPageUrl,
  pageIndex,
  pageSize,
  previousPageUrl,
  totalCount,
}: PaginationProps) {
  const firstItem = pageIndex * pageSize + 1
  const lastItem = (pageIndex + 1) * pageSize

  if (totalCount < 1) {
    return <></>
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {hasPreviousPage ? <Link href={previousPageUrl}>Previous</Link> : <span />}
        {hasNextPage ? <Link href={nextPageUrl}>Next</Link> : <span />}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:flex-col sm:items-center lg:flex-row lg:justify-between">
        <div>
          <p className="font-roboto text-sm text-gray-700">
            Showing <span className="font-medium">{firstItem}</span> to{' '}
            <span className="font-medium">{lastItem > totalCount ? totalCount : lastItem}</span> of{' '}
            <span className="font-medium">{totalCount}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {hasPreviousPage && (
              <Link
                href={previousPageUrl}
                className="relative inline-flex items-center rounded-l-md border border-gray-300 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              >
                <span className="sr-only">Previous</span>
                <Icon className="h-5 w-5" aria-hidden="true" name="arrow-left" />
              </Link>
            )}

            {hasNextPage && (
              <Link
                href={nextPageUrl}
                className="relative inline-flex items-center rounded-r-md border border-gray-300 px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              >
                <span className="sr-only">Next</span>
                <Icon className="h-5 w-5" aria-hidden="true" name="arrow-right" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
