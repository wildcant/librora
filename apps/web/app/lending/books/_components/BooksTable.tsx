'use client'

import { Checkbox } from '@/components/ui/Checkbox'
import { Table } from '@/components/ui/table/Table'
import { ColumnDef /* , RowSelectionState */ } from '@tanstack/react-table'
import { Book } from '@/lib/types'
import format from 'date-fns/format'
import Image from 'next/image'
import Link from 'next/link'
import { TableCellSticky } from '@/components/ui/table/TableRoot'
// import { useState } from 'react'

export const columns: ColumnDef<Book>[] = [
  {
    id: 'selectCoverTitle',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <TableCellSticky>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select reservation row"
        />
        <Link href={`/lending/books/${row.original.id}`}>
          <div className="flex flex-row gap-1 items-center">
            <div className="w-10 h-10">
              <Image
                src={row.original.image.url ?? '/books/book-placeholder.webp'}
                alt="book"
                width={640}
                height={480}
                className="object-cover rounded-md h-10"
              />
            </div>
            <div className="w-5/6 md:max-w-xs">
              <span className="line-clamp-2 text-xs">{row.original.title}</span>
            </div>
          </div>
        </Link>
      </TableCellSticky>
    ),
    size: 200,
    meta: { stickyLeft: true },
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
  // const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  return (
    <div className={className}>
      <Table
        data={books}
        columns={columns}
        // rowSelection={rowSelection}
        // onRowSelectionChange={(d) => {}}
      />
    </div>
  )
}
