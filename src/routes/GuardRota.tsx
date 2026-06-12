import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function GuardRota() {
  const { autenticado } = useAuth()

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
