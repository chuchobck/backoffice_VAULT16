import { api } from '@/shared/lib/api'
import type { ApiResponse, PageParams } from '@/shared/types/api.types'

export interface Empleado {
  id_empleado: number
  nombre1: string
  nombre2: string | null
  apellido1: string
  apellido2: string | null
  email: string
  telefono: string | null
  estado_emp: 'ACT' | 'INA'
  id_rol: number
  rol: { nombre_rol: string }
}

export interface EmpleadoDetalle extends Empleado {
  usuario: { id_usuario: string; email: string; fecha_creacion: string } | null
}

export interface Rol {
  id_rol: number
  nombre_rol: string
  descripcion: string | null
}

export async function getEmpleados(params: PageParams = {}) {
  const res = await api.get<ApiResponse<Empleado[]>>('/empleados', { params })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function getEmpleado(id: number) {
  const res = await api.get<ApiResponse<EmpleadoDetalle>>(`/empleados/${id}`)
  return res.data.data
}

export async function createEmpleado(data: {
  nombre1: string; nombre2?: string; apellido1: string; apellido2?: string
  email: string; telefono?: string; id_rol: number
  password: string
}) {
  const res = await api.post<ApiResponse<Empleado>>('/empleados', data)
  return res.data.data
}

export async function updateEmpleado(id: number, data: Partial<{
  nombre1: string; nombre2: string; apellido1: string; apellido2: string
  telefono: string; id_rol: number
}>) {
  const res = await api.put<ApiResponse<Empleado>>(`/empleados/${id}`, data)
  return res.data.data
}

export async function deactivateEmpleado(id: number) {
  const res = await api.delete<ApiResponse<Empleado>>(`/empleados/${id}`)
  return res.data.data
}

export async function resetPassword(id: number, nuevaPassword: string) {
  const res = await api.put<ApiResponse<void>>(`/empleados/${id}/reset-password`, { nueva_password: nuevaPassword })
  return res.data.data
}

export async function getRoles() {
  const res = await api.get<ApiResponse<Rol[]>>('/roles')
  return res.data.data
}
