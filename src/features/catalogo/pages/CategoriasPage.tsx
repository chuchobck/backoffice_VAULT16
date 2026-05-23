import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
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
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getCategorias, createCategoria, updateCategoria, deactivateCategoria, type Categoria } from '../api/catalogoApi'

const col = createColumnHelper<Categoria>()

const Schema = z.object({
  id_categoria: z.string().length(3, 'Debe tener exactamente 3 caracteres').toUpperCase(),
  nombre: z.string().min(2).max(60),
  descripcion: z.string().max(200).optional(),
})
type FormInput = z.infer<typeof Schema>

export function CategoriasPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { pagination, setPagination } = useTableState()
  const [modal, setModal] = useState<{ open: boolean; editing: Categoria | null }>({ open: false, editing: null })
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['categorias', { search: debouncedSearch, ...pagination }],
    queryFn: () => getCategorias({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, search: debouncedSearch || undefined }),
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(Schema),
  })

  const openCreate = () => { reset({ id_categoria: '', nombre: '', descripcion: '' }); setModal({ open: true, editing: null }) }
  const openEdit = (cat: Categoria) => { reset({ id_categoria: cat.id_categoria, nombre: cat.nombre, descripcion: cat.descripcion ?? '' }); setModal({ open: true, editing: cat }) }

  const saveMutation = useMutation({
    mutationFn: async (data: FormInput) => {
      if (modal.editing) return updateCategoria(modal.editing.id_categoria, { nombre: data.nombre, descripcion: data.descripcion })
      return createCategoria(data)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categorias'] }); toast.success(modal.editing ? 'Categoría actualizada' : 'Categoría creada'); setModal({ open: false, editing: null }) },
    onError: () => toast.error('Error al guardar'),
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateCategoria(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categorias'] }); toast.success('Categoría desactivada') },
    onError: () => toast.error('No se puede desactivar — tiene productos activos'),
  })

  const columns = useMemo(() => [
    col.accessor('id_categoria', {
      header: 'ID',
      cell: (info) => <span className="font-mono text-xs text-asphalt-400">{info.getValue()}</span>,
    }),
    col.accessor('nombre', { header: 'Nombre', cell: (info) => <span className="text-asphalt-200">{info.getValue()}</span> }),
    col.accessor('descripcion', { header: 'Descripción', cell: (info) => <span className="text-xs text-asphalt-400 truncate max-w-[200px] block">{info.getValue() ?? '—'}</span> }),
    col.accessor('estado', {
      header: 'Estado',
      cell: (info) => <Badge variant={info.getValue() === 'ACT' ? 'success' : 'muted'}>{info.getValue() === 'ACT' ? 'Activa' : 'Inactiva'}</Badge>,
    }),
    col.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => openEdit(row.original)}><Pencil className="h-3.5 w-3.5" /></Button>
          {row.original.estado === 'ACT' && (
            <Button variant="ghost" size="icon" aria-label="Desactivar" onClick={() => deactivateMutation.mutate(row.original.id_categoria)}>
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
            </Button>
          )}
        </div>
      ),
    }),
  ], [modal.editing])

  return (
    <div className="flex flex-col gap-5 max-w-[900px]">
      <div className="flex items-center gap-3">
        <Input placeholder="Buscar categorías…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} className="max-w-xs" />
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} className="ml-auto" onClick={openCreate}>Nueva categoría</Button>
      </div>
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} pagination={pagination} onPaginationChange={setPagination} totalRows={data?.meta.total} manualPagination />
      <Modal open={modal.open} onClose={() => setModal({ open: false, editing: null })} title={modal.editing ? 'Editar categoría' : 'Nueva categoría'} size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal({ open: false, editing: null })}>Cancelar</Button>
            <Button loading={isSubmitting} form="cat-form" type="submit">Guardar</Button>
          </>
        }
      >
        <form id="cat-form" onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="flex flex-col gap-3">
          <Input label="ID (3 caracteres)" {...register('id_categoria')} error={errors.id_categoria?.message} disabled={!!modal.editing} maxLength={3} />
          <Input label="Nombre" {...register('nombre')} error={errors.nombre?.message} />
          <Input label="Descripción" {...register('descripcion')} error={errors.descripcion?.message} />
        </form>
      </Modal>
    </div>
  )
}
