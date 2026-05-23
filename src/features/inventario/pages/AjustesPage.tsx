import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Modal } from '@/shared/components/ui/Modal'
import { useTableState } from '@/shared/hooks/useTableState'
import { getAjustes, anularAjuste, type Ajuste } from '../api/inventarioApi'
import { AjusteForm } from '../components/AjusteForm'

const col = createColumnHelper<Ajuste>()

export function AjustesPage() {
  const [showCreate, setShowCreate] = useState(false)
  const { pagination, setPagination } = useTableState()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['ajustes', pagination],
    queryFn: () => getAjustes({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize }),
  })

  const anularM = useMutation({
    mutationFn: (id: number) => anularAjuste(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ajustes'] }); qc.invalidateQueries({ queryKey: ['stock-actual'] }); toast.success('Ajuste anulado') },
    onError: () => toast.error('Error al anular ajuste'),
  })

  const columns = useMemo(() => [
    col.accessor('id_ajuste', { header: 'ID', cell: (info) => <span className="font-mono text-xs text-asphalt-500">#{info.getValue()}</span> }),
    col.accessor('tipo', {
      header: 'Tipo',
      cell: (info) => <Badge variant={info.getValue() === 'ING' ? 'success' : 'danger'}>{info.getValue() === 'ING' ? 'Ingreso' : 'Egreso'}</Badge>,
    }),
    col.accessor('motivo', { header: 'Motivo', cell: (info) => <span className="text-asphalt-300 text-xs">{info.getValue()}</span> }),
    col.accessor('usuario', { header: 'Usuario', cell: (info) => <span className="text-asphalt-400 text-xs">{info.getValue().empleado.nombre1}</span> }),
    col.accessor('fecha', { header: 'Fecha', cell: (info) => <span className="text-xs text-asphalt-400">{format(new Date(info.getValue()), 'dd MMM yyyy HH:mm', { locale: es })}</span> }),
    col.accessor('detalles', {
      header: 'Líneas',
      cell: (info) => <span className="text-asphalt-400 text-xs">{info.getValue().length}</span>,
    }),
    col.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" aria-label="Anular" onClick={() => anularM.mutate(row.original.id_ajuste)}>
          <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
        </Button>
      ),
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex justify-end">
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>Nuevo ajuste</Button>
      </div>
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} pagination={pagination} onPaginationChange={setPagination} totalRows={data?.meta.total} manualPagination />
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo ajuste de inventario" size="xl">
        <AjusteForm onSuccess={() => { qc.invalidateQueries({ queryKey: ['ajustes'] }); qc.invalidateQueries({ queryKey: ['stock-actual'] }); setShowCreate(false) }} />
      </Modal>
    </div>
  )
}
