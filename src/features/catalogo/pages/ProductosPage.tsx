import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { createColumnHelper } from '@tanstack/react-table'
import { Plus, Search } from 'lucide-react'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { useTableState } from '@/shared/hooks/useTableState'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getProductos, type Producto } from '../api/catalogoApi'

const col = createColumnHelper<Producto>()

export function ProductosPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { pagination, setPagination } = useTableState()

  const { data, isLoading } = useQuery({
    queryKey: ['productos', { search: debouncedSearch, ...pagination }],
    queryFn: () => getProductos({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, search: debouncedSearch || undefined }),
  })

  const columns = useMemo(() => [
    col.accessor('id_producto', {
      header: 'ID',
      cell: (info) => <span className="font-mono text-xs text-asphalt-500">{info.getValue()}</span>,
    }),
    col.accessor('nombre', {
      header: 'Nombre',
      cell: (info) => (
        <Link to={`/backoffice/catalogo/productos/${info.row.original.id_producto}`} className="text-electric-400 hover:text-electric-300 font-medium">
          {info.getValue()}
        </Link>
      ),
    }),
    col.accessor('categoria', {
      header: 'Categoría',
      cell: (info) => <span className="text-xs text-asphalt-400">{info.getValue().nombre}</span>,
    }),
    col.accessor('precio_venta', {
      header: 'Precio',
      cell: (info) => <span className="font-mono text-asphalt-200">${Number(info.getValue()).toFixed(2)}</span>,
    }),
    col.accessor('estado_prod', {
      header: 'Estado',
      cell: (info) => <Badge variant={info.getValue() === 'ACT' ? 'success' : 'muted'}>{info.getValue() === 'ACT' ? 'Activo' : 'Inactivo'}</Badge>,
    }),
    col.accessor((row) => row._count?.variantes ?? 0, {
      id: 'variantes',
      header: 'Variantes',
      cell: (info) => <span className="text-asphalt-400 text-xs">{info.getValue()}</span>,
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar productos…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="max-w-xs"
        />
        <span className="ml-auto text-sm text-asphalt-500">{data?.meta.total ?? 0} productos</span>
      </div>
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalRows={data?.meta.total}
        manualPagination
        emptyMessage="No hay productos"
      />
    </div>
  )
}
