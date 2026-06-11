import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Usuario } from '../types'
import api from '../services/api'

interface AuthState {
  usuario: Usuario | null
  autenticado: boolean
  login: (email: string, senha: string) => Promise<string>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      autenticado: false,

      login: async (email: string, senha: string) => {
        await api.post('/auth/login', {
          email: email,
          password: senha,
        })

        const usuario: Usuario = {
          id: 1,
          nome: 'admin',
          email,
          tipoUsuario: 'admin',
        }

        set({ usuario, autenticado: true })

        return '/bibliotecario/adicionar'
      },

      logout: () => {
        set({ usuario: null, autenticado: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)