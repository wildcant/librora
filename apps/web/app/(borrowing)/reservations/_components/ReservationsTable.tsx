'use client'

import { ReservationStatusBadge } from '@/app/_components/ReservationStatusBadge'
import { Checkbox } from '@/components/ui/Checkbox'
import { Table } from '@/components/ui/table/Table'
import { TableStickyCell } from '@/components/ui/table/TableRoot'
import { Reservation } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'
import { countries } from 'database/client'
import format from 'date-fns/format'
import Image from 'next/image'
import Link from 'next/link'

export const columns: ColumnDef<Reservation>[] = [
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
      <TableStickyCell>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select reservation row"
        />
        <Link href={`/reservations/${row.original.id}`}>
          <div className="flex flex-row gap-1 items-center">
            <div className="w-10 h-10">
              <Image
                src={row.original.book.image.url ?? '/books/book-placeholder.webp'}
                alt="book"
                width={640}
                height={480}
                className="object-cover rounded-md h-10"
              />
            </div>
            <div className="w-5/6 min-w-[40px] md:max-w-xs">
              <span className="line-clamp-2 text-xs">{row.original.book.title}</span>
            </div>
          </div>
        </Link>
      </TableStickyCell>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { stickyLeft: true },
    size: 400,
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => <ReservationStatusBadge status={row.original.status} />,
    meta: { hiddenMobile: true },
  },
  {
    id: 'Start Date',
    accessorKey: 'start',
    accessorFn: ({ start }) => format(new Date(start), 'MMM dd'),
    size: 100,
    enableSorting: true,
    sortingFn: 'datetime',
    meta: { hiddenMobile: true },
  },
  {
    id: 'End Date',
    accessorKey: 'end',
    accessorFn: ({ end }) => format(new Date(end), 'MMM dd'),
    size: 100,
    meta: { hiddenMobile: true },
  },
  {
    id: 'Location',
    accessorFn: ({ lender: { location } }) =>
      location ? `${location?.city}, ${countries[location.country].country}` : '',
    size: 300,
    meta: { hiddenMobile: true },
  },
]

type BorrowerReservationsTableProps = { reservations: Reservation[]; className?: string }
export function BorrowerReservationsTable({ reservations, className }: BorrowerReservationsTableProps) {
  return (
    <div className={className}>
      <Table data={reservations} columns={columns} className="min-h-[700px]" />
    </div>
  )
}
