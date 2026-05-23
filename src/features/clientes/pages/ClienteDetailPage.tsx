import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageSpinner } from '@/shared/components/ui/Spinner'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Select } from '@/shared/components/ui/Select'
import { getCliente, cambiarEstadoCliente } from '../api/clientesApi'
import { EstadoBadge as FacturaEstadoBadge } from '@/features/ventas/components/EstadoBadge'
import type { EstadoFactura } from '@/features/ventas/api/ventasApi'

const ESTADOS = [
  { value: 'ACT', label: 'Activo' },
  { value: 'INA', label: 'Inactivo' },
  { value: 'BLO', label: 'Bloqueado' },
]

export function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()

  const { data: cliente, isLoading } = useQuery({
    queryKey: ['clientes', id],
    queryFn: () => getCliente(Number(id)),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: (estado: 'ACT' | 'INA' | 'BLO') => cambiarEstadoCliente(Number(id), estado),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clientes'] }); toast.success('Estado actualizado') },
    onError: () => toast.error('Error al actualizar'),
  })

  if (isLoading) return <PageSpinner />
  if (!cliente) return <p className="text-asphalt-400">Cliente no encontrado</p>

  return (
    <div className="max-w-4xl flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to="/backoffice/clientes">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>Volver</Button>
        </Link>
        <h2 className="text-base font-semibold text-asphalt-100">{cliente.nombre1} {cliente.apellido1}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Datos */}
        <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
          <p className="text-xs text-asphalt-500 uppercase tracking-wider mb-3">Información</p>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-asphalt-500">Email</dt><dd className="text-asphalt-200">{cliente.email}</dd>
            <dt className="text-asphalt-500">RUC/Cédula</dt><dd className="font-mono text-asphalt-200">{cliente.ruc_cedula}</dd>
            <dt className="text-asphalt-500">Teléfono</dt><dd className="text-asphalt-200">{cliente.telefono ?? '—'}</dd>
            <dt className="text-asphalt-500">Registro</dt><dd className="text-asphalt-200">{format(new Date(cliente.fecha_registro), 'dd MMM yyyy', { locale: es })}</dd>
          </dl>
        </div>

        {/* Estado */}
        <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
          <p className="text-xs text-asphalt-500 uppercase tracking-wider mb-3">Estado de cuenta</p>
          <Select
            label="Estado"
            options={ESTADOS}
            value={cliente.estado}
            onChange={(e) => mutation.mutate(e.target.value as 'ACT' | 'INA' | 'BLO')}
            fullWidth
          />
          {cliente.estado === 'BLO' && (
            <p className="text-xs text-red-400 mt-2">Cuenta bloqueada — no puede acceder</p>
          )}
        </div>
      </div>

      {/* Pedidos */}
      <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
        <p className="text-sm font-semibold text-asphalt-200 mb-4">Historial de pedidos ({cliente.facturas.length})</p>
        {cliente.facturas.length === 0 ? (
          <p className="text-sm text-asphalt-500">Sin pedidos</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-asphalt-700">
                <th className="text-left pb-2 text-xs text-asphalt-500">Factura</th>
                <th className="text-left pb-2 text-xs text-asphalt-500">Fecha</th>
                <th className="text-left pb-2 text-xs text-asphalt-500">Estado</th>
                <th className="text-right pb-2 text-xs text-asphalt-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {cliente.facturas.map((f) => (
                <tr key={f.id_factura} className="border-b border-asphalt-800">
                  <td className="py-2">
                    <Link to={`/backoffice/ventas/${f.id_factura}`} className="text-electric-400 hover:text-electric-300 font-mono text-xs">
                      {f.numero_factura}
                    </Link>
                  </td>
                  <td className="py-2 text-xs text-asphalt-400">{format(new Date(f.fecha_emision), 'dd MMM yyyy', { locale: es })}</td>
                  <td className="py-2"><FacturaEstadoBadge estado={f.estado as EstadoFactura} /></td>
                  <td className="py-2 text-right font-mono text-asphalt-200">${Number(f.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Direcciones */}
      {cliente.direcciones.length > 0 && (
        <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
          <p className="text-sm font-semibold text-asphalt-200 mb-4">Direcciones</p>
          <div className="flex flex-col gap-2">
            {cliente.direcciones.map((d) => (
              <div key={d.id_direccion} className="flex items-center justify-between p-3 bg-asphalt-700/50 rounded-lg text-sm">
                <span className="text-asphalt-200">{d.calle}, {d.ciudad}, {d.provincia}</span>
                <Badge variant={d.activa ? 'success' : 'muted'}>{d.activa ? 'Activa' : 'Inactiva'}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
