import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { Plus, Eye, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Badge } from '@/shared/components/ui/Badge'
import { Modal } from '@/shared/components/ui/Modal'
import { useTableState } from '@/shared/hooks/useTableState'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getEmpleados, type Empleado } from '../api/personalApi'
import { LinkButton } from '@/shared/components/ui/LinkButton'
import { EmpleadoForm } from '../components/EmpleadoForm'

const col = createColumnHelper<Empleado>()

export function EmpleadosPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [showCreate, setShowCreate] = useState(false)
  const { pagination, setPagination } = useTableState()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['empleados', { search: debouncedSearch, ...pagination }],
    queryFn: () => getEmpleados({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, search: debouncedSearch || undefined }),
  })

  const columns = useMemo(() => [
    col.accessor('id_empleado', { header: 'ID', cell: (info) => <span className="font-mono text-xs text-asphalt-500">#{info.getValue()}</span> }),
    col.display({
      id: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => <span className="text-asphalt-200">{row.original.nombre1} {row.original.apellido1}</span>,
    }),
    col.accessor('email', { header: 'Email', cell: (info) => <span className="text-xs text-asphalt-400">{info.getValue()}</span> }),
    col.accessor('rol', {
      header: 'Rol',
      cell: (info) => <Badge variant="info">{info.getValue().nombre_rol}</Badge>,
    }),
    col.accessor('estado_emp', {
      header: 'Estado',
      cell: (info) => <Badge variant={info.getValue() === 'ACT' ? 'success' : 'muted'}>{info.getValue() === 'ACT' ? 'Activo' : 'Inactivo'}</Badge>,
    }),
    col.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <LinkButton to={`/backoffice/personal/${row.original.id_empleado}`} variant="ghost" size="icon" aria-label="Ver detalle"><Eye className="h-3.5 w-3.5" /></LinkButton>
      ),
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1100px]">
      <div className="flex items-center gap-3">
        <Input placeholder="Buscar empleados…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} className="max-w-xs" />
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} className="ml-auto" onClick={() => setShowCreate(true)}>Nuevo empleado</Button>
      </div>
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} pagination={pagination} onPaginationChange={setPagination} totalRows={data?.meta.total} manualPagination />
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo empleado" size="md">
        <EmpleadoForm
          onSuccess={() => { qc.invalidateQueries({ queryKey: ['empleados'] }); setShowCreate(false); toast.success('Empleado creado') }}
        />
      </Modal>
    </div>
  )
}
