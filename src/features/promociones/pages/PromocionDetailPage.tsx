import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageSpinner } from '@/shared/components/ui/Spinner'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { getPromocion, removeProductoPromocion } from '../api/promocionesApi'
import { LinkButton } from '@/shared/components/ui/LinkButton'

export function PromocionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()

  const { data: promo, isLoading } = useQuery({
    queryKey: ['promocion', id],
    queryFn: () => getPromocion(Number(id)),
    enabled: !!id,
  })

  const removeMutation = useMutation({
    mutationFn: (productoId: string) => removeProductoPromocion(Number(id), productoId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promocion', id] }); toast.success('Producto removido') },
    onError: () => toast.error('Error al remover'),
  })

  if (isLoading) return <PageSpinner />
  if (!promo) return <p className="text-asphalt-400">Promoción no encontrada</p>

  return (
    <div className="flex flex-col gap-6 max-w-[900px]">
      <div className="flex items-center gap-3">
        <LinkButton to="/backoffice/promociones" variant="ghost" size="icon" aria-label="Volver"><ArrowLeft className="h-4 w-4" /></LinkButton>
        <h2 className="text-lg font-semibold text-asphalt-100">{promo.nombre}</h2>
        <Badge variant={promo.estado === 'ACT' ? 'success' : 'muted'} className="ml-1">{promo.estado === 'ACT' ? 'Activa' : 'Inactiva'}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Descuento', value: `${Number(promo.descuento_porcentaje).toFixed(0)}%` },
          { label: 'Inicio', value: format(new Date(promo.fecha_inicio), 'dd MMM yyyy', { locale: es }) },
          { label: 'Fin', value: format(new Date(promo.fecha_fin), 'dd MMM yyyy', { locale: es }) },
          { label: 'Productos', value: promo.detalles.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-asphalt-800 rounded-lg p-4 border border-asphalt-700">
            <p className="text-xs text-asphalt-500 mb-1">{label}</p>
            <p className="text-lg font-bold text-asphalt-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-asphalt-800 rounded-xl border border-asphalt-700">
        <div className="p-4 border-b border-asphalt-700">
          <p className="text-sm font-semibold text-asphalt-200">Productos incluidos</p>
        </div>
        <div className="divide-y divide-asphalt-700/60">
          {promo.detalles.length === 0 && <p className="p-4 text-sm text-asphalt-500">Sin productos asignados</p>}
          {promo.detalles.map((d) => (
            <div key={d.id_detalle} className="flex items-center justify-between p-3 hover:bg-asphalt-700/40 transition-colors">
              <div>
                <p className="text-sm text-asphalt-200">{d.producto.nombre}</p>
                <p className="text-xs text-asphalt-500 font-mono">{d.producto.id_producto} — ${Number(d.producto.precio_venta).toFixed(2)}</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Remover" onClick={() => removeMutation.mutate(d.producto.id_producto)}>
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
