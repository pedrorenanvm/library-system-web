import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import GuardRota from './GuardRota'
import Login from '../pages/Login'
import AdicionarItem from '../pages/AdicionarItem'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<GuardRota perfisPermitidos={['admin']} />}>
          <Route path="/bibliotecario">
            <Route path="adicionar" element={<AdicionarItem />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}