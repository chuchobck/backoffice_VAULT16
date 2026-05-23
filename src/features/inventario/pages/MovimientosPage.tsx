import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search } from 'lucide-react'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Input } from '@/shared/components/ui/Input'
import { Badge } from '@/shared/components/ui/Badge'
import { useTableState } from '@/shared/hooks/useTableState'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getMovimientos, type Movimiento } from '../api/inventarioApi'

const col = createColumnHelper<Movimiento>()

export function MovimientosPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { pagination, setPagination } = useTableState()

  const { data, isLoading } = useQuery({
    queryKey: ['movimientos', { search: debouncedSearch, ...pagination }],
    queryFn: () => getMovimientos({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, search: debouncedSearch || undefined }),
  })

  const columns = useMemo(() => [
    col.accessor('id_movimiento', { header: 'ID', cell: (info) => <span className="font-mono text-xs text-asphalt-500">#{info.getValue()}</span> }),
    col.accessor('variante', {
      header: 'Producto',
      cell: (info) => (
        <div>
          <p className="text-asphalt-200 text-sm">{info.getValue().producto.nombre} — {info.getValue().talla.nombre_talla}</p>
          <p className="font-mono text-xs text-asphalt-500">{info.getValue().sku}</p>
        </div>
      ),
    }),
    col.accessor('tipo', {
      header: 'Tipo',
      cell: (info) => {
        const t = info.getValue()
        const isPositive = ['ING', 'DEV', 'AJU_ING'].includes(t)
        return <Badge variant={isPositive ? 'success' : 'danger'}>{t}</Badge>
      },
    }),
    col.accessor('cantidad', {
      header: 'Cantidad',
      cell: (info) => <span className="font-mono font-semibold text-asphalt-200">{info.getValue()}</span>,
    }),
    col.accessor('stock_resultante', {
      header: 'Stock resultante',
      cell: (info) => <span className="font-mono text-asphalt-300">{info.getValue()}</span>,
    }),
    col.accessor('fecha', {
      header: 'Fecha',
      cell: (info) => <span className="text-xs text-asphalt-400">{format(new Date(info.getValue()), 'dd MMM yyyy HH:mm', { locale: es })}</span>,
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex items-center gap-3">
        <Input placeholder="Buscar por SKU…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} className="max-w-xs" />
        <span className="ml-auto text-sm text-asphalt-500">{data?.meta.total ?? 0} movimientos</span>
      </div>
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} pagination={pagination} onPaginationChange={setPagination} totalRows={data?.meta.total} manualPagination />
    </div>
  )
}
