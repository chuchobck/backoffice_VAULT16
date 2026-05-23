import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Eye } from 'lucide-react'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Button } from '@/shared/components/ui/Button'
import { useTableState } from '@/shared/hooks/useTableState'
import { getSesiones, type SesionIA } from '../api/asistenteIAApi'
import { LinkButton } from '@/shared/components/ui/LinkButton'

const col = createColumnHelper<SesionIA>()

export function SesionesPage() {
  const { pagination, setPagination } = useTableState()

  const { data, isLoading } = useQuery({
    queryKey: ['sesiones-ia', pagination],
    queryFn: () => getSesiones({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize }),
  })

  const columns = useMemo(() => [
    col.accessor('id_sesion', { header: 'ID', cell: (info) => <span className="font-mono text-xs text-asphalt-500">{info.getValue().slice(0, 8)}…</span> }),
    col.accessor('cliente', {
      header: 'Cliente',
      cell: (info) => info.getValue()
        ? <span className="text-asphalt-200">{info.getValue()!.nombre1} {info.getValue()!.apellido1}</span>
        : <span className="text-asphalt-500 italic">Anónimo</span>,
    }),
    col.accessor('mensajes_count', {
      header: 'Mensajes',
      cell: (info) => <span className="font-mono text-asphalt-300">{info.getValue()}</span>,
    }),
    col.accessor('fecha_inicio', {
      header: 'Inicio',
      cell: (info) => <span className="text-xs text-asphalt-400">{format(new Date(info.getValue()), 'dd MMM yyyy HH:mm', { locale: es })}</span>,
    }),
    col.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <LinkButton to={`/backoffice/asistente-ia/sesiones/${row.original.id_sesion}`} variant="ghost" size="icon" aria-label="Ver sesión"><Eye className="h-3.5 w-3.5" /></LinkButton>
      ),
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1000px]">
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} pagination={pagination} onPaginationChange={setPagination} totalRows={data?.meta.total} manualPagination />
    </div>
  )
}
