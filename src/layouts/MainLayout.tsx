import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAuth } from '../hooks/useAuth'

export default function MainLayout() {
  const { usuario } = useAuth()

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Header
          titulo="Biblioteca"
          nome={usuario?.nome ?? ''}
          linkImg="/avatar.png"
        />
        <main style={{ flex: 1, overflow: 'auto', padding: 32 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}