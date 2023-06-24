import * as React from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const TableRoot = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
)
TableRoot.displayName = 'TableRoot'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  )
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('bg-primary font-medium text-primary-foreground', className)} {...props} />
  )
)
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b transition-colors', className, 'data-[state=selected]:bg-muted')}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-8 px-1 md:px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 uppercase text-[12px]',
        className
      )}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-2 py-2 md:px-4 align-middle [&:has([role=checkbox])]:pr-0 text-xs', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-4 text-xs text-muted-foreground', className)} {...props} />
  )
)
TableCaption.displayName = 'TableCaption'

interface TablePaginationProps<TData> {
  table: Table<TData>
}

function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  return (
    <div className="flex justify-end">
      <div className="flex items-center space-x-2 h-10 overflow-hidden">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const TableHeadSticky = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('md:border-r md:py-2 md:px-2 md:shadow-r-md', className)} {...props} />
  )
)
TableHeadSticky.displayName = 'TableHeadSticky'

const TableCellSticky = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex gap-2 items-center md:border-r md:shadow-r-md md:px-2 md:py-2', className)}
      {...props}
    />
  )
)
TableCellSticky.displayName = 'TableCellSticky'

export {
  TableBody,
  TableCaption,
  TableCell,
  TableCellSticky,
  TableFooter,
  TableHead,
  TableHeadSticky,
  TableHeader,
  TablePagination,
  TableRoot,
  TableRow,
}
