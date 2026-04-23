import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { TipoUsuario } from '../types'

interface Props {
  perfisPermitidos: TipoUsuario[]
}

export default function GuardRota({ perfisPermitidos }: Props) {
  const { usuario, autenticado } = useAuth()

  if (!autenticado || !usuario) {
    return <Navigate to="/login" replace />
  }

  if (!perfisPermitidos.includes(usuario.tipoUsuario)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
