import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

interface Usuario {
  id: string
  nome: string
  email: string
  role: string
}

interface AuthState {
  autenticado: boolean
  usuario: Usuario | null
  login: (email: string, senha: string) => Promise<string>
  logout: () => void
  carregarUsuario: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      autenticado: false,
      usuario: null,

      login: async (email: string, senha: string) => {
        await api.post('/v1/api/auth/login', { email, password: senha })

        const res = await api.get('/v1/api/readers/info')
        const user = res.data

        const usuario: Usuario = {
          id: user.id,
          nome: user.name,
          email: user.email,
          role: user.role,
        }

        set({ autenticado: true, usuario })

        const redirects: Record<string, string> = {
          reader: '/leitor',
          teacher: '/professor',
          admin: '/bibliotecario/dashboard',
        }

        return redirects[usuario.role] || '/login'
      },

      logout: () => {
        api.post('/v1/api/auth/logout').catch(() => {})
        set({ autenticado: false, usuario: null })
      },

      carregarUsuario: async () => {
        try {
          const res = await api.get('/v1/api/readers/info')
          const user = res.data
          set({
            autenticado: true,
            usuario: {
              id: user.id,
              nome: user.name,
              email: user.email,
              role: user.role,
            }
          })
        } catch {
          set({ autenticado: false, usuario: null })
        }
      },
    }),
    { name: 'auth-storage' }
  )
)