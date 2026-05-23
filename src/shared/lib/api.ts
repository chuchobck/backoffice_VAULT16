import axios from 'axios'
import { BO_TOKEN_KEY } from '@/shared/stores/authBoStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Inyectar Bearer token ──────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(BO_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Manejar 401 ──────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(BO_TOKEN_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
