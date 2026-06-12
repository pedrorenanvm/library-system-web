import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'
import { type Usuario } from '../types'

interface AuthState {
  autenticado: boolean
  login: (email: string, senha: string) => Promise<string>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      autenticado: false,

      login: async (email: string, senha: string) => {
        await api.post('/v1/api/auth/login', { email, password: senha })
        set({ autenticado: true })
        return '/bibliotecario/adicionar'
      },

      logout: () => {
        set({ autenticado: false })
      },
    }),
    { name: 'auth-storage' }
  )
)