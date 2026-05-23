import { useState } from 'react'
import type { SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table'

interface TableStateOptions {
  defaultPageSize?: number
}

export function useTableState({ defaultPageSize = 20 }: TableStateOptions = {}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })
  const [globalFilter, setGlobalFilter] = useState('')

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
  }
}
