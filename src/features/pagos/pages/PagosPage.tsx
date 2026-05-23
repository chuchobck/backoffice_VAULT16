import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search } from 'lucide-react'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Input } from '@/shared/components/ui/Input'
import { Badge } from '@/shared/components/ui/Badge'
import { Select } from '@/shared/components/ui/Select'
import { useTableState } from '@/shared/hooks/useTableState'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getPagos, type Pago, type EstadoPago } from '../api/pagosApi'

const col = createColumnHelper<Pago>()

const ESTADO_COLORS: Record<EstadoPago, 'info' | 'success' | 'danger' | 'muted'> = {
  PEN: 'info', COM: 'success', FAL: 'danger', REE: 'muted',
}
const ESTADO_LABELS: Record<EstadoPago, string> = {
  PEN: 'Pendiente', COM: 'Completado', FAL: 'Fallido', REE: 'Reembolsado',
}
const TIPO_LABELS: Record<string, string> = {
  STR: 'Stripe', PAY: 'PayPal', TRA: 'Transferencia', REE: 'Reembolso',
}

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'PEN', label: 'Pendiente' },
  { value: 'COM', label: 'Completado' },
  { value: 'FAL', label: 'Fallido' },
  { value: 'REE', label: 'Reembolsado' },
]

export function PagosPage() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState<EstadoPago | ''>('')
  const debouncedSearch = useDebounce(search)
  const { pagination, setPagination } = useTableState()

  const { data, isLoading } = useQuery({
    queryKey: ['pagos', { search: debouncedSearch, estado, ...pagination }],
    queryFn: () => getPagos({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, search: debouncedSearch || undefined, estado: (estado as EstadoPago) || undefined }),
  })

  const columns = useMemo(() => [
    col.accessor('id_pago', {
      header: 'ID',
      cell: (info) => (
        <Link to={`/backoffice/pagos/${info.getValue()}`} className="text-electric-400 hover:text-electric-300 font-mono text-xs">
          #{info.getValue()}
        </Link>
      ),
    }),
    col.accessor('factura', {
      header: 'Factura',
      cell: (info) => (
        <Link to={`/backoffice/ventas/${info.getValue().id_factura}`} className="text-asphalt-300 hover:text-asphalt-100 font-mono text-xs">
          {info.getValue().numero_factura}
        </Link>
      ),
    }),
    col.accessor('tipo', {
      header: 'Método',
      cell: (info) => <span className="text-asphalt-300 text-xs">{TIPO_LABELS[info.getValue()] ?? info.getValue()}</span>,
    }),
    col.accessor('estado', {
      header: 'Estado',
      cell: (info) => <Badge variant={ESTADO_COLORS[info.getValue()]}>{ESTADO_LABELS[info.getValue()]}</Badge>,
    }),
    col.accessor('monto', {
      header: 'Monto',
      cell: (info) => <span className="font-mono text-asphalt-200">${Number(info.getValue()).toFixed(2)}</span>,
    }),
    col.accessor('fecha_pago', {
      header: 'Fecha',
      cell: (info) => info.getValue()
        ? format(new Date(info.getValue()!), 'dd MMM yyyy', { locale: es })
        : <span className="text-asphalt-500">—</span>,
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="max-w-xs"
        />
        <Select options={ESTADOS} value={estado} onChange={(e) => setEstado(e.target.value as EstadoPago | '')} placeholder="" className="w-44" aria-label="Filtrar por estado" />
      </div>
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalRows={data?.meta.total}
        manualPagination
        emptyMessage="No hay pagos"
      />
    </div>
  )
}
