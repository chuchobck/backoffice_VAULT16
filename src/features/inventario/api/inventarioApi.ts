import { api } from '@/shared/lib/api'
import type { ApiResponse, PageParams } from '@/shared/types/api.types'

export interface StockItem {
  id_variante: number
  sku: string
  nombre_producto: string
  id_producto: string
  talla: string
  stock: number
  precio_venta: string
  estado_prod: string
}

export interface Ajuste {
  id_ajuste: number
  tipo: 'ING' | 'EGR'
  motivo: string
  fecha: string
  usuario: { email: string; empleado: { nombre1: string } }
  detalles: {
    id_detalle: number
    cantidad: number
    variante: { sku: string; talla: { nombre_talla: string } }
  }[]
}

export interface Movimiento {
  id_movimiento: number
  tipo: string
  cantidad: number
  stock_resultante: number
  referencia: string | null
  fecha: string
  variante: {
    sku: string
    producto: { nombre: string }
    talla: { nombre_talla: string }
  }
}

export async function getStockActual(params: PageParams = {}) {
  const res = await api.get<ApiResponse<StockItem[]>>('/inventario/stock-actual', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function getAjustes(params: PageParams = {}) {
  const res = await api.get<ApiResponse<Ajuste[]>>('/inventario/ajustes', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function createAjuste(data: {
  tipo: 'ING' | 'EGR'
  motivo: string
  lineas: { id_variante: number; cantidad: number }[]
}) {
  const res = await api.post<ApiResponse<Ajuste>>('/inventario/ajustes', data)
  return res.data.data
}

export async function anularAjuste(id: number) {
  const res = await api.put<ApiResponse<Ajuste>>(`/inventario/ajustes/${id}/anular`, {})
  return res.data.data
}

export async function getMovimientos(params: PageParams & { id_variante?: number } = {}) {
  const res = await api.get<ApiResponse<Movimiento[]>>('/inventario/movimientos', { params })
  return { data: res.data.data, meta: res.data.meta! }
}
