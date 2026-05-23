import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { PageSpinner } from '@/shared/components/ui/Spinner'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Modal } from '@/shared/components/ui/Modal'
import { getPago, confirmarPago, reembolsarPago } from '../api/pagosApi'

const TIPO_LABELS: Record<string, string> = { STR: 'Stripe', PAY: 'PayPal', TRA: 'Transferencia', REE: 'Reembolso' }
const ESTADO_COLORS: Record<string, 'info' | 'success' | 'danger' | 'muted'> = { PEN: 'info', COM: 'success', FAL: 'danger', REE: 'muted' }
const ESTADO_LABELS: Record<string, string> = { PEN: 'Pendiente', COM: 'Completado', FAL: 'Fallido', REE: 'Reembolsado' }

export function PagoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const [confirmModal, setConfirmModal] = useState<'confirmar' | 'reembolsar' | null>(null)

  const { data: pago, isLoading } = useQuery({
    queryKey: ['pagos', id],
    queryFn: () => getPago(Number(id)),
    enabled: !!id,
  })

  const confirmar = useMutation({
    mutationFn: () => confirmarPago(Number(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pagos'] }); toast.success('Pago confirmado'); setConfirmModal(null) },
    onError: () => toast.error('Error al confirmar pago'),
  })

  const reembolsar = useMutation({
    mutationFn: () => reembolsarPago(Number(id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pagos'] }); toast.success('Reembolso procesado'); setConfirmModal(null) },
    onError: () => toast.error('Error al procesar reembolso'),
  })

  if (isLoading) return <PageSpinner />
  if (!pago) return <p className="text-asphalt-400">Pago no encontrado</p>

  return (
    <div className="max-w-xl flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link to="/backoffice/pagos">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>Volver</Button>
        </Link>
        <h2 className="text-base font-semibold text-asphalt-100">Pago #{pago.id_pago}</h2>
        <Badge variant={ESTADO_COLORS[pago.estado]}>{ESTADO_LABELS[pago.estado]}</Badge>
      </div>

      <div className="bg-asphalt-800 border border-asphalt-700 rounded-xl p-5 grid grid-cols-2 gap-4 text-sm">
        <div><p className="text-xs text-asphalt-500 mb-1">Método</p><p className="text-asphalt-200">{TIPO_LABELS[pago.tipo] ?? pago.tipo}</p></div>
        <div><p className="text-xs text-asphalt-500 mb-1">Monto</p><p className="font-mono font-bold text-electric-400">${Number(pago.monto).toFixed(2)}</p></div>
        <div><p className="text-xs text-asphalt-500 mb-1">Factura</p>
          <Link to={`/backoffice/ventas/${pago.factura.id_factura}`} className="text-electric-400 hover:text-electric-300 font-mono text-xs">{pago.factura.numero_factura}</Link>
        </div>
        <div><p className="text-xs text-asphalt-500 mb-1">Fecha</p>
          <p className="text-asphalt-200">{pago.fecha_pago ? format(new Date(pago.fecha_pago), "dd MMM yyyy", { locale: es }) : '—'}</p>
        </div>
        {pago.referencia_externa && (
          <div className="col-span-2"><p className="text-xs text-asphalt-500 mb-1">Referencia externa</p><p className="font-mono text-xs text-asphalt-300 break-all">{pago.referencia_externa}</p></div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        {pago.estado === 'PEN' && pago.tipo === 'TRA' && (
          <Button leftIcon={<CheckCircle className="h-4 w-4" />} onClick={() => setConfirmModal('confirmar')}>
            Confirmar transferencia
          </Button>
        )}
        {pago.estado === 'COM' && (
          <Button variant="danger" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setConfirmModal('reembolsar')}>
            Reembolsar
          </Button>
        )}
      </div>

      <Modal
        open={confirmModal === 'confirmar'}
        onClose={() => setConfirmModal(null)}
        title="Confirmar pago"
        description="¿Confirmar el pago de esta transferencia?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmModal(null)}>Cancelar</Button>
            <Button loading={confirmar.isPending} onClick={() => confirmar.mutate()}>Confirmar</Button>
          </>
        }
      >
        <p className="text-sm text-asphalt-300">Monto: <strong className="text-electric-400">${Number(pago.monto).toFixed(2)}</strong></p>
      </Modal>

      <Modal
        open={confirmModal === 'reembolsar'}
        onClose={() => setConfirmModal(null)}
        title="Procesar reembolso"
        description="Esta acción creará un registro de reembolso."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmModal(null)}>Cancelar</Button>
            <Button variant="danger" loading={reembolsar.isPending} onClick={() => reembolsar.mutate()}>Reembolsar</Button>
          </>
        }
      >
        <p className="text-sm text-asphalt-300">Monto a reembolsar: <strong className="text-red-400">${Number(pago.monto).toFixed(2)}</strong></p>
      </Modal>
    </div>
  )
}
