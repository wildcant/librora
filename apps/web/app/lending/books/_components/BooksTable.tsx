'use client'

import { Checkbox } from '@/components/ui/Checkbox'
import { Table } from '@/components/ui/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { DatabaseTypes } from 'database/client'
import { Book } from 'database/server'
import format from 'date-fns/format'
import Image from 'next/image'
import Link from 'next/link'

export const columns: ColumnDef<DatabaseTypes.Book>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'coverTitle',
    cell: ({ row }) => (
      <Link href={`/lending/books/${row.original.id}`}>
        <div className="flex flex-row gap-1">
          <div className="w-1/6 max-w-[56px]">
            <Image
              src={row.original.cover ?? '/books/book-placeholder.webp'}
              alt="book"
              width={640}
              height={480}
              className="object-cover rounded-md"
            />
          </div>
          <div className="w-5/6 md:max-w-xs">
            <span className="line-clamp-2 text-xs">{row.original.title}</span>
          </div>
        </div>
      </Link>
    ),
  },
  {
    header: 'Pages',
    accessorKey: 'numPages',
    meta: { hiddenMobile: true },
  },
  {
    id: 'updatedAt',
    header: 'Last Modified',
    accessorFn: ({ updatedAt }) => format(new Date(updatedAt), 'MMM dd'),
    meta: { hiddenMobile: true },
  },
]

type BooksTableProps = { books: Book[]; className?: string }
export function BooksTable({ books, className }: BooksTableProps) {
  return (
    <div className={className}>
      <Table data={books} columns={columns} className="min-h-[700px]" />
    </div>
  )
}
