import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

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
      height: '100vh', background: '#f0f0f0'
    }}>
      <div style={{
        background: '#fff', padding: 48, borderRadius: 12,
        width: 600, height:600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <h2 style={{ marginBottom: 100 }}> Biblioteca</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%', padding: 12, marginBottom: 48,
            borderRadius: 6, border: '1px solid #0e55da',
            boxSizing: 'border-box', fontSize: 15
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: '100%', padding: 12, marginBottom: 108,
            borderRadius: 6, border: '1px solid #0e55da',
            boxSizing: 'border-box', fontSize: 15
          }}
        />

        {erro && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{erro}</p>}

        <button
          onClick={handleLogin}
          style={{
            width: '300px',height:'50px', padding: 12, background: '#0e55da',
            color: '#fff', border: 'none', borderRadius: 6,
            cursor: 'pointer', fontSize: 15
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  )
}