import type { EstadoFactura } from '../api/ventasApi'
import { Badge } from '@/shared/components/ui/Badge'

const ESTADO_CONFIG: Record<EstadoFactura, { label: string; variant: 'default' | 'info' | 'success' | 'warning' | 'danger' | 'muted' }> = {
  EMI: { label: 'Emitida',    variant: 'info' },
  PAG: { label: 'Pagada',     variant: 'success' },
  ENV: { label: 'Enviada',    variant: 'warning' },
  ENT: { label: 'Entregada',  variant: 'success' },
  ANU: { label: 'Anulada',    variant: 'danger' },
}

export function EstadoBadge({ estado }: { estado: EstadoFactura }) {
  const cfg = ESTADO_CONFIG[estado] ?? { label: estado, variant: 'muted' as const }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}
