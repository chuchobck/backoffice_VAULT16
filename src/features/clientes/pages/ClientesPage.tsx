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
import { useTableState } from '@/shared/hooks/useTableState'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getClientes, type Cliente } from '../api/clientesApi'

const col = createColumnHelper<Cliente>()

const ESTADO_MAP: Record<string, 'success' | 'danger' | 'warning'> = {
  ACT: 'success', INA: 'muted' as never, BLO: 'danger',
}
const ESTADO_LABELS: Record<string, string> = { ACT: 'Activo', INA: 'Inactivo', BLO: 'Bloqueado' }

export function ClientesPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { pagination, setPagination } = useTableState()

  const { data, isLoading } = useQuery({
    queryKey: ['clientes', { search: debouncedSearch, ...pagination }],
    queryFn: () => getClientes({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, search: debouncedSearch || undefined }),
  })

  const columns = useMemo(() => [
    col.accessor((row) => `${row.nombre1} ${row.apellido1}`, {
      id: 'nombre',
      header: 'Nombre',
      cell: (info) => (
        <Link to={`/backoffice/clientes/${info.row.original.id_cliente}`} className="text-electric-400 hover:text-electric-300">
          {info.getValue()}
        </Link>
      ),
    }),
    col.accessor('email', { header: 'Email', cell: (info) => <span className="text-asphalt-300 text-xs">{info.getValue()}</span> }),
    col.accessor('ruc_cedula', { header: 'RUC/Cédula', cell: (info) => <span className="font-mono text-xs text-asphalt-400">{info.getValue()}</span> }),
    col.accessor('estado', {
      header: 'Estado',
      cell: (info) => <Badge variant={ESTADO_MAP[info.getValue()]}>{ESTADO_LABELS[info.getValue()]}</Badge>,
    }),
    col.accessor('fecha_registro', {
      header: 'Registro',
      cell: (info) => <span className="text-xs text-asphalt-400">{format(new Date(info.getValue()), 'dd MMM yyyy', { locale: es })}</span>,
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="max-w-xs"
        />
        <span className="ml-auto text-sm text-asphalt-500">{data?.meta.total ?? 0} clientes</span>
      </div>
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        totalRows={data?.meta.total}
        manualPagination
        emptyMessage="No hay clientes"
      />
    </div>
  )
}
