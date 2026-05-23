import { api } from '@/shared/lib/api'
import type { ApiResponse, PageParams } from '@/shared/types/api.types'

export type EstadoPago = 'PEN' | 'COM' | 'FAL' | 'REE'
export type TipoPago = 'STR' | 'PAY' | 'TRA' | 'REE'

export interface Pago {
  id_pago: number
  tipo: TipoPago
  estado: EstadoPago
  monto: string
  referencia_externa: string | null
  fecha_pago: string | null
  factura: {
    id_factura: number
    numero_factura: string
  }
}

interface PagosParams extends PageParams {
  estado?: EstadoPago
}

export async function getPagos(params: PagosParams = {}) {
  const res = await api.get<ApiResponse<Pago[]>>('/pagos', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function getPago(id: number) {
  const res = await api.get<ApiResponse<Pago>>(`/pagos/${id}`)
  return res.data.data
}

export async function confirmarPago(id: number) {
  const res = await api.put<ApiResponse<Pago>>(`/pagos/${id}/confirmar`, {})
  return res.data.data
}

export async function reembolsarPago(id: number) {
  const res = await api.put<ApiResponse<Pago>>(`/pagos/${id}/reembolsar`, {})
  return res.data.data
}
