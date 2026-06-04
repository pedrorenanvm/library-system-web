import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api' 
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
        const response = await api.post('/auth/login', {
          email,
          password: senha,
        })
        const { token, user } = response.data
        localStorage.setItem('token', token)

        const usuarioReal: Usuario = {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipoUsuario: user.role, 
        }

      
        set({ usuario: usuarioReal, autenticado: true })

    
        const redirects: Record<string, string> = {
          reader:  '/login',
          teacher: '/login',
          admin:   '/bibliotecario/adicionar',
        }

        return redirects[usuarioReal.tipoUsuario] || '/login'
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ usuario: null, autenticado: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)