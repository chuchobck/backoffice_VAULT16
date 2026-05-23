import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const BO_TOKEN_KEY = 'vault16_bo_token'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BoUser {
  id_usuario: string
  email: string
  rol: string
  empleado: {
    nombre1: string
    apellido1: string
  }
}

interface AuthBoStore {
  user: BoUser | null
  token: string | null
  isAuthenticated: boolean
  login: (user: BoUser, token: string) => void
  logout: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthBoStore = create<AuthBoStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem(BO_TOKEN_KEY, token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem(BO_TOKEN_KEY)
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'vault16-bo-auth' },
  ),
)
