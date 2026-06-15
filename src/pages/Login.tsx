import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/BibliotecAppLogo.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const path = await login(email, senha)
      navigate(path)
    } catch {
      setErro('Email ou senha inválidos.')
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', 
      background: 'linear-gradient(90deg,rgba(43, 43, 118, 1) 0%, rgba(25, 25, 97, 1) 50%, rgba(20, 20, 71, 1) 100%)'
    }}>
      <div style={{
        background: '#fff', padding: 48, borderRadius: 12,
        width: 550, height:550, boxShadow: '7px 12px 31px -12px rgba(0,0,0,0.75)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        
      <img src={logo} alt="BibliotecaApp"  style={{ width: 250, marginBottom: 24, marginTop: -20 }}/>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%', padding: 12, marginBottom: 48,
            borderRadius: '30px 30px 30px 30px', border: '1px solid #0e55da',
            boxSizing: 'border-box', fontSize: 15, fontFamily:'Arrow Narrow, sans-serif'
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: '100%', padding: 12, 
            borderRadius: '30px 30px 30px 30px', border: '1px solid #0e55da',
            boxSizing: 'border-box', fontSize: 15
          }}
          
        />


        {erro && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{erro}</p>}

        <button
          onClick={handleLogin}
          style={{
            width: '300px',height:'50px', padding: 12, background: '#004488',
            color: '#fff', border: 'none', borderRadius: '39px 39px 39px 39px',
            cursor: 'pointer', fontSize: '20px', boxShadow: '7px 12px 31px -12px rgba(0,0,0,0.75)',
            fontFamily:'Arial Narrow, sans-serif', marginTop:70

          }}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}