import { api } from '@/shared/lib/api'
import type { ApiResponse } from '@/shared/types/api.types'
import type { BoUser } from '@/shared/stores/authBoStore'

interface LoginResponse {
  user: BoUser
  token: string
}

export async function loginBackoffice(payload: { email: string; password: string }) {
  const res = await api.post<ApiResponse<LoginResponse>>('/auth/login-backoffice', payload)
  return res.data.data
}
