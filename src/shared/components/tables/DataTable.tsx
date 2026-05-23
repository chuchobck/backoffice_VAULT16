import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  getSortedRowModel,
  type PaginationState,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/shared/components/ui/Button'
import { Spinner } from '@/shared/components/ui/Spinner'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  isLoading?: boolean
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  pagination?: PaginationState
  onPaginationChange?: (pagination: PaginationState) => void
  totalRows?: number
  manualPagination?: boolean
  manualSorting?: boolean
  emptyMessage?: string
}

export function DataTable<TData>({
  data,
  columns,
  isLoading,
  sorting = [],
  onSortingChange,
  pagination,
  onPaginationChange,
  totalRows,
  manualPagination = false,
  manualSorting = false,
  emptyMessage = 'No hay registros',
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      ...(pagination ? { pagination } : {}),
    },
    onSortingChange: onSortingChange as never,
    onPaginationChange: onPaginationChange as never,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(pagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    manualPagination,
    manualSorting,
    pageCount: manualPagination && pagination && totalRows
      ? Math.ceil(totalRows / pagination.pageSize)
      : undefined,
  })

  return (
    <div className="flex flex-col gap-3">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-asphalt-700">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-asphalt-700 bg-asphalt-800">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium text-asphalt-400 uppercase tracking-wider whitespace-nowrap',
                      header.column.getCanSort() && 'cursor-pointer select-none hover:text-asphalt-200',
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-asphalt-600">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="h-3 w-3" aria-hidden="true" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ChevronsUpDown className="h-3 w-3" aria-hidden="true" />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <Spinner className="mx-auto" />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-asphalt-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-asphalt-800 transition-colors',
                    i % 2 === 0 ? 'bg-asphalt-900' : 'bg-asphalt-900/60',
                    'hover:bg-asphalt-800/60',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-asphalt-200 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-asphalt-400">
          <span>
            {totalRows !== undefined
              ? `${totalRows} registros`
              : `${table.getFilteredRowModel().rows.length} registros`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="px-2 text-asphalt-300">
              {pagination.pageIndex + 1} / {table.getPageCount() || 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
