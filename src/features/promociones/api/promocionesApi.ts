import { api } from '@/shared/lib/api'
import type { ApiResponse, PageParams } from '@/shared/types/api.types'

export interface Promocion {
  id_promocion: number
  nombre: string
  descripcion: string | null
  descuento_porcentaje: string
  fecha_inicio: string
  fecha_fin: string
  estado: 'ACT' | 'INA'
  _count?: { detalles: number }
}

export interface PromocionDetalle extends Promocion {
  detalles: {
    id_detalle: number
    producto: { id_producto: string; nombre: string; precio_venta: string }
  }[]
}

export async function getPromociones(params: PageParams & { includeAll?: boolean } = {}) {
  const res = await api.get<ApiResponse<Promocion[]>>('/promociones/all', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function getPromocion(id: number) {
  const res = await api.get<ApiResponse<PromocionDetalle>>(`/promociones/${id}`)
  return res.data.data
}

export async function createPromocion(data: {
  nombre: string
  descripcion?: string
  descuento_porcentaje: number
  fecha_inicio: string
  fecha_fin: string
}) {
  const res = await api.post<ApiResponse<Promocion>>('/promociones', data)
  return res.data.data
}

export async function addProductoPromocion(id: number, productoIds: string[]) {
  const res = await api.post<ApiResponse<PromocionDetalle>>(`/promociones/${id}/productos`, { producto_ids: productoIds })
  return res.data.data
}

export async function removeProductoPromocion(id: number, productoId: string) {
  const res = await api.delete<ApiResponse<PromocionDetalle>>(`/promociones/${id}/productos/${productoId}`)
  return res.data.data
}

export async function deactivatePromocion(id: number) {
  const res = await api.delete<ApiResponse<Promocion>>(`/promociones/${id}`)
  return res.data.data
}
