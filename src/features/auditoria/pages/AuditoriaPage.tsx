import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Input } from '@/shared/components/ui/Input'
import { Badge } from '@/shared/components/ui/Badge'
import { useTableState } from '@/shared/hooks/useTableState'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getAuditoria, type AuditEntry } from '../api/auditoriaApi'

const col = createColumnHelper<AuditEntry>()

function PayloadViewer({ data }: { data: Record<string, unknown> | null }) {
  const [open, setOpen] = useState(false)
  if (!data) return <span className="text-xs text-asphalt-600">—</span>
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-xs text-electric-400 hover:underline">
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {open ? 'Ocultar' : 'Ver datos'}
      </button>
      {open && (
        <pre className="mt-1 text-[10px] bg-asphalt-900 text-asphalt-300 rounded p-2 max-h-40 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}

const ACTION_COLORS: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'muted'> = {
  CREATE: 'success', INSERT: 'success',
  UPDATE: 'info',
  DELETE: 'danger', DEACTIVATE: 'warning',
}

export function AuditoriaPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { pagination, setPagination } = useTableState()

  const { data, isLoading } = useQuery({
    queryKey: ['auditoria', { search: debouncedSearch, ...pagination }],
    queryFn: () => getAuditoria({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, search: debouncedSearch || undefined }),
  })

  const columns = useMemo(() => [
    col.accessor('id_auditoria', { header: 'ID', cell: (info) => <span className="font-mono text-xs text-asphalt-500">#{info.getValue()}</span> }),
    col.accessor('accion', {
      header: 'Acción',
      cell: (info) => <Badge variant={ACTION_COLORS[info.getValue()] ?? 'muted'}>{info.getValue()}</Badge>,
    }),
    col.accessor('tabla', { header: 'Tabla', cell: (info) => <span className="font-mono text-xs text-asphalt-400">{info.getValue()}</span> }),
    col.accessor('registro_id', { header: 'Registro ID', cell: (info) => <span className="font-mono text-xs text-asphalt-500">{info.getValue()}</span> }),
    col.accessor('usuario', {
      header: 'Usuario',
      cell: (info) => info.getValue()
        ? <span className="text-xs text-asphalt-300">{info.getValue()!.empleado.nombre1} {info.getValue()!.empleado.apellido1}</span>
        : <span className="text-xs text-asphalt-600 italic">Sistema</span>,
    }),
    col.accessor('payload_antes', { header: 'Antes', cell: (info) => <PayloadViewer data={info.getValue()} /> }),
    col.accessor('payload_despues', { header: 'Después', cell: (info) => <PayloadViewer data={info.getValue()} /> }),
    col.accessor('fecha', {
      header: 'Fecha',
      cell: (info) => <span className="text-xs text-asphalt-400 whitespace-nowrap">{format(new Date(info.getValue()), 'dd/MM/yy HH:mm', { locale: es })}</span>,
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1400px]">
      <div className="flex items-center gap-3">
        <Input placeholder="Buscar por tabla o acción…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} className="max-w-xs" />
        <span className="ml-auto text-sm text-asphalt-500">{data?.meta.total ?? 0} registros</span>
      </div>
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} pagination={pagination} onPaginationChange={setPagination} totalRows={data?.meta.total} manualPagination />
    </div>
  )
}
