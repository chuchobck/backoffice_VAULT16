import { api } from '@/shared/lib/api'
import type { ApiResponse, PageParams } from '@/shared/types/api.types'

export interface SesionIA {
  id_sesion: string
  cliente: { id_cliente: string; nombre1: string; apellido1: string } | null
  mensajes_count: number
  fecha_inicio: string
  fecha_ultimo_mensaje: string | null
}

export interface MensajeIA {
  id_mensaje: number
  rol: 'user' | 'assistant'
  contenido: string
  fecha: string
  tokens_usados: number | null
}

export interface SesionDetalle extends SesionIA {
  mensajes: MensajeIA[]
}

export interface MetricasIA {
  total_sesiones: number
  total_mensajes: number
  total_tokens: number
  avg_mensajes_por_sesion: number
  sesiones_por_dia: { fecha: string; sesiones: number; mensajes: number }[]
}

export async function getSesiones(params: PageParams = {}) {
  const res = await api.get<ApiResponse<SesionIA[]>>('/admin/sesiones', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function getSesion(id: string) {
  const res = await api.get<ApiResponse<SesionDetalle>>(`/assistant/sesiones/${id}`)
  return res.data.data
}

export async function getMetricasIA() {
  const res = await api.get<ApiResponse<MetricasIA>>('/admin/metricas-ia')
  return res.data.data
}
