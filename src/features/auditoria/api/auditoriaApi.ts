import { api } from '@/shared/lib/api'
import type { ApiResponse, PageParams } from '@/shared/types/api.types'

export interface AuditEntry {
  id_auditoria: number
  accion: string
  tabla: string
  registro_id: string
  payload_antes: Record<string, unknown> | null
  payload_despues: Record<string, unknown> | null
  fecha: string
  usuario: { email: string; empleado: { nombre1: string; apellido1: string } } | null
  ip: string | null
}

export async function getAuditoria(params: PageParams & { tabla?: string; accion?: string } = {}) {
  const res = await api.get<ApiResponse<AuditEntry[]>>('/audit', { params })
  return { data: res.data.data, meta: res.data.meta! }
}
