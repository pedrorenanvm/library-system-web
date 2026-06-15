import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  const { carregarUsuario } = useAuth()

  useEffect(() => {
    carregarUsuario()
  }, [])

  return <AppRoutes />
}