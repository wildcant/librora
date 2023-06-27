'use client'

import { ReservationStatusBadge } from '@/app/_components/ReservationStatusBadge'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import { Table } from '@/components/ui/table/Table'
import { TableCellSticky, TableHeadSticky } from '@/components/ui/table/TableRoot'
import { useToast } from '@/components/ui/toast/use-toast'
import { api } from '@/lib/api/client'
import { ResponseError } from '@/lib/api/types'
import { BorrowerReservation } from '@/lib/types'
import { PopoverContent } from '@radix-ui/react-popover'
import { useMutation } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { ReservationStatus, countries } from 'database/client'
import format from 'date-fns/format'
import { MoreVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'

type BorrowerResActionsProps = BorrowerReservation & { onFinish: () => void }
function BorrowerPendingReservationActions({ onFinish, ...props }: BorrowerResActionsProps) {
  const router = useRouter()
  const { toast } = useToast()

  const cancelReservation = useMutation<{}, ResponseError[]>({
    mutationFn: () => api.post(`/api/reservations/${props.id}/cancel`),
    onError: async (errors) => errors.map(toast),
    onSuccess: () => router.refresh(),
    onSettled: () => onFinish(),
  })

  return (
    <Button
      variant="ghost"
      className="justify-start pl-4 text-xs"
      onClick={() => {
        cancelReservation.mutate()
      }}
      loading={cancelReservation.isLoading}
    >
      Cancel
    </Button>
  )
}

function BorrowerReservationActions(props: BorrowerReservation) {
  const [open, setOpen] = useState(false)

  // TODO: Add actions for all reservation states.
  const actions: { [key in ReservationStatus]?: ReactNode } = {
    PENDING: <BorrowerPendingReservationActions {...props} onFinish={() => setOpen(false)} />,
  }

  const action = actions[props.status]

  return action ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="rounded-full h-8 w-8 flex justify-center items-center data-[state=open]:shadow-md">
        <MoreVertical />
      </PopoverTrigger>
      <PopoverContent className="w-48 bg-white rounded-sm shadow-md py-2 border" align="end" sideOffset={10}>
        <div className="flex flex-col">{actions[props.status]}</div>
      </PopoverContent>
    </Popover>
  ) : (
    <></>
  )
}

const columns: ColumnDef<BorrowerReservation>[] = [
  {
    id: 'selectCoverTitle',
    header: ({ table }) => (
      <TableHeadSticky>
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </TableHeadSticky>
    ),
    cell: ({ row }) => (
      <TableCellSticky>
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
      </TableCellSticky>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { stickyLeft: true },
    size: 300,
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
  {
    id: 'action',
    cell: ({ row }) => <BorrowerReservationActions {...row.original} />,
    meta: { hiddenMobile: true },
  },
]

type BorrowerReservationsTableProps = { reservations: BorrowerReservation[]; className?: string }
export function BorrowerReservationsTable({ reservations, className }: BorrowerReservationsTableProps) {
  return (
    <div className={className}>
      <Table data={reservations} columns={columns} />
    </div>
  )
}
