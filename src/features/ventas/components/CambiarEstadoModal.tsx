import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Select } from '@/shared/components/ui/Select'
import { cambiarEstadoFactura, type EstadoFactura } from '../api/ventasApi'

const ESTADOS: { value: EstadoFactura; label: string }[] = [
  { value: 'EMI', label: 'Emitida' },
  { value: 'PAG', label: 'Pagada' },
  { value: 'ENV', label: 'Enviada' },
  { value: 'ENT', label: 'Entregada' },
  { value: 'ANU', label: 'Anulada' },
]

interface CambiarEstadoModalProps {
  open: boolean
  onClose: () => void
  facturaId: number
  estadoActual: EstadoFactura
}

export function CambiarEstadoModal({ open, onClose, facturaId, estadoActual }: CambiarEstadoModalProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoFactura>(estadoActual)
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => cambiarEstadoFactura(facturaId, nuevoEstado),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['facturas'] })
      toast.success('Estado actualizado')
      onClose()
    },
    onError: () => toast.error('Error al actualizar estado'),
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cambiar estado"
      description={`Factura #${facturaId}`}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button
            loading={mutation.isPending}
            disabled={nuevoEstado === estadoActual}
            onClick={() => mutation.mutate()}
          >
            Guardar
          </Button>
        </>
      }
    >
      <Select
        label="Nuevo estado"
        options={ESTADOS}
        value={nuevoEstado}
        onChange={(e) => setNuevoEstado(e.target.value as EstadoFactura)}
        fullWidth
      />
    </Modal>
  )
}
