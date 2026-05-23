import { api } from '@/shared/lib/api'
import type { ApiResponse, PageParams } from '@/shared/types/api.types'

export interface Cliente {
  id_cliente: number
  ruc_cedula: string
  nombre1: string
  apellido1: string
  email: string
  telefono: string | null
  estado: 'ACT' | 'INA' | 'BLO'
  fecha_registro: string
}

export interface ClienteDetalle extends Cliente {
  facturas: {
    id_factura: number
    numero_factura: string
    fecha_emision: string
    estado: string
    total: string
  }[]
  direcciones: {
    id_direccion: number
    calle: string
    ciudad: string
    provincia: string
    activa: boolean
  }[]
}

export async function getClientes(params: PageParams = {}) {
  const res = await api.get<ApiResponse<Cliente[]>>('/clientes', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function getCliente(id: number) {
  const res = await api.get<ApiResponse<ClienteDetalle>>(`/clientes/${id}`)
  return res.data.data
}

export async function cambiarEstadoCliente(id: number, estado: 'ACT' | 'INA' | 'BLO') {
  const res = await api.put<ApiResponse<Cliente>>(`/clientes/${id}/estado`, { estado })
  return res.data.data
}
