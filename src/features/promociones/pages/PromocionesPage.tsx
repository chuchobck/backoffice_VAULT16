import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Trash2, Eye, Search } from 'lucide-react'

import toast from 'react-hot-toast'
import { DataTable } from '@/shared/components/tables/DataTable'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Badge } from '@/shared/components/ui/Badge'
import { Modal } from '@/shared/components/ui/Modal'
import { useTableState } from '@/shared/hooks/useTableState'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { getPromociones, deactivatePromocion, createPromocion, type Promocion } from '../api/promocionesApi'
import { LinkButton } from '@/shared/components/ui/LinkButton'
import { PromocionForm } from '../components/PromocionForm'

const col = createColumnHelper<Promocion>()

export function PromocionesPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [showCreate, setShowCreate] = useState(false)
  const { pagination, setPagination } = useTableState()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['promociones', { search: debouncedSearch, ...pagination }],
    queryFn: () => getPromociones({ page: pagination.pageIndex + 1, pageSize: pagination.pageSize, search: debouncedSearch || undefined }),
  })

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivatePromocion(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promociones'] }); toast.success('Promoción desactivada') },
    onError: () => toast.error('Error al desactivar'),
  })

  const columns = useMemo(() => [
    col.accessor('id_promocion', { header: 'ID', cell: (info) => <span className="font-mono text-xs text-asphalt-500">#{info.getValue()}</span> }),
    col.accessor('nombre', { header: 'Nombre', cell: (info) => <span className="font-medium text-asphalt-200">{info.getValue()}</span> }),
    col.accessor('descuento_porcentaje', {
      header: 'Descuento',
      cell: (info) => <Badge variant="info">{Number(info.getValue()).toFixed(0)}%</Badge>,
    }),
    col.accessor('fecha_inicio', {
      header: 'Inicio',
      cell: (info) => <span className="text-xs text-asphalt-400">{format(new Date(info.getValue()), 'dd MMM yyyy', { locale: es })}</span>,
    }),
    col.accessor('fecha_fin', {
      header: 'Fin',
      cell: (info) => <span className="text-xs text-asphalt-400">{format(new Date(info.getValue()), 'dd MMM yyyy', { locale: es })}</span>,
    }),
    col.accessor('estado', {
      header: 'Estado',
      cell: (info) => <Badge variant={info.getValue() === 'ACT' ? 'success' : 'muted'}>{info.getValue() === 'ACT' ? 'Activa' : 'Inactiva'}</Badge>,
    }),
    col.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <LinkButton to={`/backoffice/promociones/${row.original.id_promocion}`} variant="ghost" size="icon" aria-label="Ver detalle"><Eye className="h-3.5 w-3.5" /></LinkButton>
          {row.original.estado === 'ACT' && (
            <Button variant="ghost" size="icon" aria-label="Desactivar" onClick={() => deactivateMutation.mutate(row.original.id_promocion)}>
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
            </Button>
          )}
        </div>
      ),
    }),
  ], [])

  return (
    <div className="flex flex-col gap-5 max-w-[1100px]">
      <div className="flex items-center gap-3">
        <Input placeholder="Buscar promociones…" value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} className="max-w-xs" />
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} className="ml-auto" onClick={() => setShowCreate(true)}>Nueva promoción</Button>
      </div>
      <DataTable data={data?.data ?? []} columns={columns} isLoading={isLoading} pagination={pagination} onPaginationChange={setPagination} totalRows={data?.meta.total} manualPagination />
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nueva promoción" size="md">
        <PromocionForm
          onSuccess={(promo) => {
            qc.invalidateQueries({ queryKey: ['promociones'] })
            setShowCreate(false)
            toast.success(`Promoción "${promo.nombre}" creada`)
          }}
        />
      </Modal>
    </div>
  )
}
