import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Badge } from '@/shared/components/ui/Badge'
import { Modal } from '@/shared/components/ui/Modal'
import { useTableState } from '@/shared/hooks/useTableState'
import { getTallas, createTalla, deactivateTalla, type Talla } from '../api/catalogoApi'

const col = createColumnHelper<Talla>()
const Schema = z.object({ nombre_talla: z.string().min(1).max(20) })
type FormInput = z.infer<typeof Schema>

export function TallasPage() {
  const [modal, setModal] = useState(false)
  const qc = useQueryClient()
  const { pagination, setPagination } = useTableState()

  const { data, isLoading } = useQuery({
    queryKey: ['tallas', pagination],
    queryFn: () => getTallas({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize }),
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormInput>({ resolver: zodResolver(Schema) })

  const createMutation = useMutation({
    mutationFn: createTalla,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tallas'] }); toast.success('Talla creada'); reset(); setModal(false) },
    onError: () => toast.error('Error al crear talla'),
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateTalla(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tallas'] }); toast.success('Talla desactivada') },
    onError: () => toast.error('No se puede desactivar — tiene variantes activas'),
  })

  const columns = useMemo(() => [
    col.accessor('id_talla', { header: 'ID', cell: (info) => <span className="font-mono text-xs text-asphalt-500">#{info.getValue()}</span> }),
    col.accessor('nombre_talla', { header: 'Talla', cell: (info) => <span className="font-semibold text-asphalt-100">{info.getValue()}</span> }),
    col.accessor('estado', {
      header: 'Estado',
      cell: (info) => <Badge variant={info.getValue() === 'ACT' ? 'success' : 'muted'}>{info.getValue() === 'ACT' ? 'Activa' : 'Inactiva'}</Badge>,
    }),
    col.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => row.original.estado === 'ACT' ? (
        <Button variant="ghost" size="icon" aria-label="Desactivar" onClick={() => deactivateMutation.mutate(row.original.id_talla)}>
          <Trash2 className="h-3.5 w-3.5 text-red-400" />
        </Button>
      ) : null,
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[600px]">
      <div className="flex justify-end">
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModal(true)}>Nueva talla</Button>
      </div>
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} pagination={pagination} onPaginationChange={setPagination} totalRows={data?.meta.total} manualPagination />
      <Modal open={modal} onClose={() => setModal(false)} title="Nueva talla" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button loading={isSubmitting} form="talla-form" type="submit">Crear</Button>
          </>
        }
      >
        <form id="talla-form" onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="flex flex-col gap-3">
          <Input label="Nombre de talla (ej: XS, S, M, L, XL)" {...register('nombre_talla')} error={errors.nombre_talla?.message} />
        </form>
      </Modal>
    </div>
  )
}
