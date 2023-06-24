'use client'

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TablePagination,
  TableRoot,
  TableRow,
} from '@/components/ui/table/TableRoot'
import { cn } from '@/lib/utils'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  className?: string
}

export function Table<TData, TValue>({ columns, data, className }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className={cn('flex flex-col justify-between', className)}>
      <div className="rounded-md">
        <TableRoot>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { columnDef } = header.column
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        {
                          'hidden md:table-cell': columnDef.meta?.hiddenMobile,
                          'md:sticky md:bg-white left-0 !p-0': columnDef.meta?.stickyLeft,
                        },
                        columnDef.meta?.headerClassName
                      )}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : flexRender(columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => {
                      const { columnDef } = cell.column
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            {
                              'hidden md:table-cell': columnDef.meta?.hiddenMobile,
                              'md:sticky md:bg-white md:left-0 md:p-0': columnDef.meta?.stickyLeft,
                            },
                            columnDef.meta?.className,
                            { '!bg-muted': row.getIsSelected() },
                            `md:w-[${cell.column.getSize()}px] md:max-w-[${cell.column.getSize()}px] md:min-w-[${cell.column.getSize()}px]`
                          )}
                        >
                          {flexRender(columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableRoot>
      </div>
      <TablePagination table={table} />
    </div>
  )
}
