import { api } from '@/shared/lib/api'
import type { ApiResponse, PageParams } from '@/shared/types/api.types'

export type EstadoFactura = 'EMI' | 'PAG' | 'ENV' | 'ENT' | 'ANU'

export interface Factura {
  id_factura: number
  numero_factura: string
  fecha_emision: string
  estado: EstadoFactura
  subtotal: string
  impuesto: string
  total: string
  cliente: {
    id_cliente: number
    nombre1: string
    apellido1: string
    email: string
  }
}

export interface FacturaDetalle extends Factura {
  detalles: {
    id_detalle: number
    cantidad: number
    precio_unitario: string
    subtotal: string
    variante: {
      sku: string
      talla: { nombre_talla: string }
      producto: { nombre: string }
    }
  }[]
  pagos: {
    id_pago: number
    tipo: string
    estado: string
    monto: string
    fecha_pago: string | null
  }[]
  direccion_envio: {
    calle: string
    ciudad: string
    provincia: string
  } | null
}

interface FacturasParams extends PageParams {
  estado?: EstadoFactura
}

export async function getFacturas(params: FacturasParams = {}) {
  const res = await api.get<ApiResponse<Factura[]>>('/facturas', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function getFactura(id: number) {
  const res = await api.get<ApiResponse<FacturaDetalle>>(`/facturas/${id}`)
  return res.data.data
}

export async function cambiarEstadoFactura(id: number, estado: EstadoFactura) {
  const res = await api.put<ApiResponse<Factura>>(`/facturas/${id}/estado`, { estado })
  return res.data.data
}
