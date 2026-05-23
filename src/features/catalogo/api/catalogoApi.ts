import { api } from '@/shared/lib/api'
import type { ApiResponse, PageParams } from '@/shared/types/api.types'

// ─── Categorías ───────────────────────────────────────────────────────────────

export interface Categoria {
  id_categoria: string
  nombre: string
  descripcion: string | null
  estado: 'ACT' | 'INA'
}

export async function getCategorias(params: PageParams = {}) {
  const res = await api.get<ApiResponse<Categoria[]>>('/categorias', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function createCategoria(data: { id_categoria: string; nombre: string; descripcion?: string }) {
  const res = await api.post<ApiResponse<Categoria>>('/categorias', data)
  return res.data.data
}

export async function updateCategoria(id: string, data: { nombre?: string; descripcion?: string }) {
  const res = await api.put<ApiResponse<Categoria>>(`/categorias/${id}`, data)
  return res.data.data
}

export async function deactivateCategoria(id: string) {
  const res = await api.delete<ApiResponse<Categoria>>(`/categorias/${id}`)
  return res.data.data
}

// ─── Tallas ──────────────────────────────────────────────────────────────────

export interface Talla {
  id_talla: number
  nombre_talla: string
  estado: 'ACT' | 'INA'
}

export async function getTallas(params: PageParams = {}) {
  const res = await api.get<ApiResponse<Talla[]>>('/tallas', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function createTalla(data: { nombre_talla: string }) {
  const res = await api.post<ApiResponse<Talla>>('/tallas', data)
  return res.data.data
}

export async function deactivateTalla(id: number) {
  const res = await api.delete<ApiResponse<Talla>>(`/tallas/${id}`)
  return res.data.data
}

// ─── Productos ────────────────────────────────────────────────────────────────

export interface Producto {
  id_producto: string
  nombre: string
  descripcion_corta: string | null
  precio_venta: string
  estado_prod: 'ACT' | 'INA'
  id_categoria: string
  categoria: { nombre: string }
  _count?: { variantes: number; fotos: number }
}

export interface ProductoDetalle extends Producto {
  descripcion_larga: string | null
  variantes: Variante[]
  fotos: Foto[]
  producto_ai: { descripcion_generada: string | null; embedding_generado: boolean } | null
}

export interface Variante {
  id_variante: number
  sku: string
  stock: number
  precio_oferta: string | null
  estado: 'ACT' | 'INA'
  talla: { id_talla: number; nombre_talla: string }
}

export interface Foto {
  id_foto: number
  url_foto: string
  es_principal: boolean
  orden: number
}

export async function getProductos(params: PageParams & { includeInactive?: boolean } = {}) {
  const res = await api.get<ApiResponse<Producto[]>>('/productos', { params: { ...params, includeInactive: params.includeInactive ?? true } })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function getProducto(id: string) {
  const res = await api.get<ApiResponse<ProductoDetalle>>(`/productos/${id}`)
  return res.data.data
}

export async function createProducto(data: {
  id_producto: string
  id_categoria: string
  nombre: string
  descripcion_corta?: string
  descripcion_larga?: string
  precio_venta: number
}) {
  const res = await api.post<ApiResponse<Producto>>('/productos', data)
  return res.data.data
}

export async function updateProducto(id: string, data: {
  nombre?: string
  descripcion_corta?: string
  descripcion_larga?: string
  precio_venta?: number
  id_categoria?: string
}) {
  const res = await api.put<ApiResponse<Producto>>(`/productos/${id}`, data)
  return res.data.data
}

export async function toggleProductoEstado(id: string) {
  const res = await api.delete<ApiResponse<Producto>>(`/productos/${id}`)
  return res.data.data
}

export async function generateAIContent(id: string) {
  const res = await api.post<ApiResponse<{ descripcion_generada: string }>>(`/productos/${id}/generate-ai`, {})
  return res.data.data
}

// ─── Variantes ────────────────────────────────────────────────────────────────

export async function createVariante(productoId: string, data: { id_talla: number; sku: string; stock: number; precio_oferta?: number }) {
  const res = await api.post<ApiResponse<Variante>>(`/productos/${productoId}/variantes`, data)
  return res.data.data
}

export async function updateVariante(id: number, data: { stock?: number; precio_oferta?: number }) {
  const res = await api.put<ApiResponse<Variante>>(`/variantes/${id}`, data)
  return res.data.data
}

// ─── Fotos ────────────────────────────────────────────────────────────────────

export async function uploadFoto(productoId: string, file: File) {
  const formData = new FormData()
  formData.append('foto', file)
  const res = await api.post<ApiResponse<Foto>>(`/productos/${productoId}/fotos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data
}

export async function deleteFoto(fotoId: number) {
  const res = await api.delete<ApiResponse<Foto>>(`/productos/fotos/${fotoId}`)
  return res.data.data
}
