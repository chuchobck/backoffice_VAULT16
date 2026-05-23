import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, Filter } from 'lucide-react'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select'
import { useTableState } from '@/shared/hooks/useTableState'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { EstadoBadge } from '../components/EstadoBadge'
import { getFacturas, type Factura, type EstadoFactura } from '../api/ventasApi'

const col = createColumnHelper<Factura>()

const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'EMI', label: 'Emitida' },
  { value: 'PAG', label: 'Pagada' },
  { value: 'ENV', label: 'Enviada' },
  { value: 'ENT', label: 'Entregada' },
  { value: 'ANU', label: 'Anulada' },
]

export function FacturasPage() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState<EstadoFactura | ''>('')
  const debouncedSearch = useDebounce(search)
  const { pagination, setPagination } = useTableState()

  const { data, isLoading } = useQuery({
    queryKey: ['facturas', { search: debouncedSearch, estado, ...pagination }],
    queryFn: () =>
      getFacturas({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        search: debouncedSearch || undefined,
        estado: (estado as EstadoFactura) || undefined,
      }),
  })

  const columns = useMemo(
    () => [
      col.accessor('numero_factura', {
        header: 'Nº Factura',
        cell: (info) => (
          <Link to={`/backoffice/ventas/${info.row.original.id_factura}`} className="text-electric-400 hover:text-electric-300 font-mono text-xs">
            {info.getValue()}
          </Link>
        ),
      }),
      col.accessor('fecha_emision', {
        header: 'Fecha',
        cell: (info) => format(new Date(info.getValue()), 'dd MMM yyyy', { locale: es }),
      }),
      col.accessor((row) => `${row.cliente.nombre1} ${row.cliente.apellido1}`, {
        id: 'cliente',
        header: 'Cliente',
        cell: (info) => <span className="text-asphalt-300">{info.getValue()}</span>,
      }),
      col.accessor('estado', {
        header: 'Estado',
        cell: (info) => <EstadoBadge estado={info.getValue()} />,
      }),
      col.accessor('total', {
        header: 'Total',
        cell: (info) => (
          <span className="font-mono text-asphalt-200">${Number(info.getValue()).toFixed(2)}</span>
        ),
      }),
    ],
    [],
  )

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar por nº factura, cliente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" aria-hidden="true" />}
          className="max-w-xs"
        />
        <Select
          options={ESTADOS}
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoFactura | '')}
          placeholder=""
          className="w-44"
          aria-label="Filtrar por estado"
        />
        <span className="ml-auto text-sm text-asphalt-500">
          <Filter className="h-4 w-4 inline mr-1" aria-hidden="true" />
          {data?.meta.total ?? 0} resultados
        </span>
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalRows={data?.meta.total}
        manualPagination
        emptyMessage="No hay facturas"
      />
    </div>
  )
}
