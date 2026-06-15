import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import GuardRota from './GuardRota'
import Login from '../pages/Login'
import AdicionarItem from '../pages/AdicionarItem'
import CadastrarLeitor from '../pages/CadastrarLeitor'
import Devolucao from '../pages/Devolucao'
import Emprestimos from '../pages/Emprestimos'
import MultasDoLeitor from '../pages/MultasDoLeitor'
import VerItens from '../pages/VerItens';
import Assinaturas from '../pages/Assinaturas'
import RegistrarPerda from '../pages/RegistrarPerda'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<GuardRota perfisPermitidos={['admin']} />}>
          <Route path="/bibliotecario">
            <Route path="adicionar" element={<AdicionarItem />} />
            <Route path="adicionarLeitor" element={<CadastrarLeitor />}></Route>
            <Route path='novoEmprestimo' element={<Emprestimos />}></Route>
            <Route path="adicionarDevolucao" element={<Devolucao />}></Route>
            <Route path="pagarMulta" element={<MultasDoLeitor/>}></Route>
            <Route path="/bibliotecario/acervo" element={<VerItens />} />
            <Route path="assinaturas" element={<Assinaturas />} />
            <Route path="registrarPerda" element={<RegistrarPerda />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}