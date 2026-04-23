import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Usuario } from '../types'

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
        const usuarioMock: Usuario = {
          id: 1,
          nome: 'Gabriel',
          email,
          tipoUsuario: 'admin',
        }

        set({ usuario: usuarioMock, autenticado: true })

        const redirects: Record<string, string> = {
          reader:  '/login',
          teacher: '/login',
          admin:   '/bibliotecario/adicionar',
        }

        return redirects[usuarioMock.tipoUsuario]
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