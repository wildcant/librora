import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    hiddenMobile?: boolean
    className?: string
    headerClassName?: string
    stickyLeft?: boolean
  }
}
