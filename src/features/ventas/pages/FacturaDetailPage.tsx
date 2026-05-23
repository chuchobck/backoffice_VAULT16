import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, RefreshCcw } from 'lucide-react'
import { PageSpinner } from '@/shared/components/ui/Spinner'
import { Button } from '@/shared/components/ui/Button'
import { EstadoBadge } from '../components/EstadoBadge'
import { CambiarEstadoModal } from '../components/CambiarEstadoModal'
import { getFactura } from '../api/ventasApi'

export function FacturaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [showModal, setShowModal] = useState(false)

  const { data: factura, isLoading } = useQuery({
    queryKey: ['facturas', id],
    queryFn: () => getFactura(Number(id)),
    enabled: !!id,
  })

  if (isLoading) return <PageSpinner />
  if (!factura) return <p className="text-asphalt-400">Factura no encontrada</p>

  return (
    <div className="max-w-4xl flex flex-col gap-5">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link to="/backoffice/ventas">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>Volver</Button>
        </Link>
        <h2 className="text-base font-semibold text-asphalt-100 font-mono ml-1">{factura.numero_factura}</h2>
        <EstadoBadge estado={factura.estado} />
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCcw className="h-3.5 w-3.5" />}
          className="ml-auto"
          onClick={() => setShowModal(true)}
        >
          Cambiar estado
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cliente */}
        <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-4">
          <p className="text-xs text-asphalt-500 uppercase tracking-wider mb-2">Cliente</p>
          <p className="text-sm font-medium text-asphalt-100">
            {factura.cliente.nombre1} {factura.cliente.apellido1}
          </p>
          <p className="text-sm text-asphalt-400">{factura.cliente.email}</p>
          <Link to={`/backoffice/clientes/${factura.cliente.id_cliente}`} className="text-xs text-electric-400 mt-2 inline-block">
            Ver perfil →
          </Link>
        </div>

        {/* Fechas */}
        <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-4">
          <p className="text-xs text-asphalt-500 uppercase tracking-wider mb-2">Fecha</p>
          <p className="text-sm text-asphalt-200">
            {format(new Date(factura.fecha_emision), "dd 'de' MMMM yyyy", { locale: es })}
          </p>
        </div>

        {/* Totales */}
        <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-4">
          <p className="text-xs text-asphalt-500 uppercase tracking-wider mb-2">Totales</p>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between"><span className="text-asphalt-400">Subtotal</span><span className="font-mono text-asphalt-200">${Number(factura.subtotal).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-asphalt-400">IVA</span><span className="font-mono text-asphalt-200">${Number(factura.impuesto).toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-asphalt-700 pt-1 mt-1"><span className="font-medium text-asphalt-200">Total</span><span className="font-mono font-bold text-electric-400">${Number(factura.total).toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-asphalt-200 mb-4">Líneas de pedido</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-asphalt-700">
              <th className="text-left pb-2 text-xs text-asphalt-500">Producto</th>
              <th className="text-left pb-2 text-xs text-asphalt-500">SKU</th>
              <th className="text-right pb-2 text-xs text-asphalt-500">Cant.</th>
              <th className="text-right pb-2 text-xs text-asphalt-500">Precio</th>
              <th className="text-right pb-2 text-xs text-asphalt-500">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {factura.detalles.map((d) => (
              <tr key={d.id_detalle} className="border-b border-asphalt-800">
                <td className="py-2.5 text-asphalt-200">
                  {d.variante.producto.nombre} — {d.variante.talla.nombre_talla}
                </td>
                <td className="py-2.5 font-mono text-xs text-asphalt-500">{d.variante.sku}</td>
                <td className="py-2.5 text-right text-asphalt-300">{d.cantidad}</td>
                <td className="py-2.5 text-right font-mono text-asphalt-300">${Number(d.precio_unitario).toFixed(2)}</td>
                <td className="py-2.5 text-right font-mono text-asphalt-200">${Number(d.subtotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagos */}
      {factura.pagos.length > 0 && (
        <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-asphalt-200 mb-4">Pagos</h3>
          {factura.pagos.map((p) => (
            <div key={p.id_pago} className="flex items-center justify-between py-2 border-b border-asphalt-800 last:border-0 text-sm">
              <span className="text-asphalt-400">{p.tipo} — {p.estado}</span>
              <span className="font-mono text-electric-400">${Number(p.monto).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <CambiarEstadoModal
        open={showModal}
        onClose={() => setShowModal(false)}
        facturaId={factura.id_factura}
        estadoActual={factura.estado}
      />
    </div>
  )
}
