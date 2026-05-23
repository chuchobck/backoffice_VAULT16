import { api } from '@/shared/lib/api'
import type { ApiResponse } from '@/shared/types/api.types'

export interface KPIs {
  ventasHoy: number
  pedidosPendientes: number
  clientesActivos: number
  ingresosMes: number
}

export interface VentaDia {
  fecha: string
  total: number
  cantidad: number
}

export interface TopProducto {
  id_producto: string
  nombre: string
  cantidad_vendida: number
  ingreso_total: number
}

export interface StockBajoItem {
  id_variante: number
  sku: string
  nombre_producto: string
  talla: string
  stock: number
}

export interface UsoIA {
  total_sesiones: number
  total_mensajes: number
  productos_recomendados: number
}

export async function getKPIs() {
  const res = await api.get<ApiResponse<KPIs>>('/dashboard/kpis')
  return res.data.data
}

export async function getVentasPorDia() {
  const res = await api.get<ApiResponse<VentaDia[]>>('/dashboard/ventas-por-dia')
  return res.data.data
}

export async function getTopProductos() {
  const res = await api.get<ApiResponse<TopProducto[]>>('/dashboard/top-productos')
  return res.data.data
}

export async function getStockBajo() {
  const res = await api.get<ApiResponse<StockBajoItem[]>>('/dashboard/stock-bajo')
  return res.data.data
}

export async function getUsoIA() {
  const res = await api.get<ApiResponse<UsoIA>>('/dashboard/uso-ia')
  return res.data.data
}
