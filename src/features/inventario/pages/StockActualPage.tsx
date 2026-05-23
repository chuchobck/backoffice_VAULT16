import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { Search, AlertTriangle } from 'lucide-react'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Input } from '@/shared/components/ui/Input'
import { useTableState } from '@/shared/hooks/useTableState'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getStockActual, type StockItem } from '../api/inventarioApi'

const col = createColumnHelper<StockItem>()

export function StockActualPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { pagination, setPagination } = useTableState()

  const { data, isLoading } = useQuery({
    queryKey: ['stock-actual', { search: debouncedSearch, ...pagination }],
    queryFn: () => getStockActual({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, search: debouncedSearch || undefined }),
  })

  const columns = useMemo(() => [
    col.accessor('sku', { header: 'SKU', cell: (info) => <span className="font-mono text-xs text-asphalt-400">{info.getValue()}</span> }),
    col.accessor('nombre_producto', { header: 'Producto', cell: (info) => <span className="text-asphalt-200">{info.getValue()}</span> }),
    col.accessor('talla', { header: 'Talla', cell: (info) => <span className="text-asphalt-300">{info.getValue()}</span> }),
    col.accessor('stock', {
      header: 'Stock',
      cell: (info) => {
        const v = info.getValue()
        return (
          <div className="flex items-center gap-1.5">
            {v <= 5 && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />}
            <span className={`font-mono font-bold ${v === 0 ? 'text-red-400' : v <= 5 ? 'text-amber-400' : 'text-green-400'}`}>
              {v}
            </span>
          </div>
        )
      },
    }),
    col.accessor('precio_venta', {
      header: 'Precio',
      cell: (info) => <span className="font-mono text-asphalt-300">${Number(info.getValue()).toFixed(2)}</span>,
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1000px]">
      <div className="flex items-center gap-3">
        <Input placeholder="Buscar por SKU o producto…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} className="max-w-xs" />
        <span className="ml-auto text-sm text-asphalt-500">{data?.meta.total ?? 0} variantes</span>
      </div>
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} pagination={pagination} onPaginationChange={setPagination} totalRows={data?.meta.total} manualPagination />
    </div>
  )
}
