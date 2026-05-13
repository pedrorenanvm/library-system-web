import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import GuardRota from './GuardRota'
import Login from '../pages/Login'
import AdicionarItem from '../pages/AdicionarItem'
import CadastrarLeitor from '../pages/CadastrarLeitor'
import Devolucao from '../pages/Devolucao'
import MultasDoLeitor from '../pages/MultasDoLeitor'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<GuardRota perfisPermitidos={['admin']} />}>
          <Route path="/bibliotecario">
            <Route path="adicionar" element={<AdicionarItem />} />
            <Route path="adicionarLeitor" element={<CadastrarLeitor />}></Route>
            <Route path="adicionarDevolucao" element={<Devolucao />}></Route>
            <Route path="pagarMulta" element={<MultasDoLeitor/>}></Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}