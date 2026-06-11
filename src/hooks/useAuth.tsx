import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'
import { type Usuario } from '../types'

interface AuthState {
  usuario: Usuario | null
  autenticado: boolean
  login: (email: string, senha: string) => Promise<string>
  logout: () => void
  verificarSessao: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      autenticado: false,

      login: async (email: string, senha: string) => {
        const response = await api.post('/auth/login', {
          email,
          password: senha,
        })
        const { user } = response.data

        const usuarioReal: Usuario = {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipoUsuario: user.role,
        }

        set({ usuario: usuarioReal, autenticado: true })

        const redirects: Record<string, string> = {
          reader: '/login',
          teacher: '/login',
          admin: '/bibliotecario/adicionar',
        }

        return redirects[usuarioReal.tipoUsuario] || '/login'
      },

      logout: () => {
        api.post('/auth/logout').catch(() => {})
        set({ usuario: null, autenticado: false })
      },

      verificarSessao: async () => {
        try {
          const response = await api.get('/auth/me')
          const { user } = response.data

          const usuarioReal: Usuario = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipoUsuario: user.role,
          }

          set({ usuario: usuarioReal, autenticado: true })
        } catch {
          set({ usuario: null, autenticado: false })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)