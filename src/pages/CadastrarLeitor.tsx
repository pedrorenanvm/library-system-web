import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./CadastrarLeitor.module.css";
import { useState } from "react";
import api from "../services/api";

function CadastrarLeitor() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCPF] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<'sucesso' | 'erro' | null>(null);

  const validar = () => {
    const novosErros: Record<string, string> = {};

    if (!nome.trim())
      novosErros.nome = 'Nome é obrigatório';
    else if (nome.trim().length < 3)
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';

    if (!email.trim())
      novosErros.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email))
      novosErros.email = 'Informe um e-mail válido';

    if (!cpf.trim())
      novosErros.cpf = 'CPF é obrigatório';
    if(cpf.length < 11)
      novosErros.cpf = 'CPF com tamanho insuficiente'
    if (!senha.trim())
      novosErros.senha = 'Senha é obrigatória';
    else if (senha.length < 8)
      novosErros.senha = 'Senha deve ter pelo menos 8 caracteres';

    if (telefone && telefone.replace(/\D/g, '').length > 20)
      novosErros.telefone = 'Telefone inválido';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  async function adicionarLeitor(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    try {
      await api.post('/v1/api/readers', {
        name: nome,
        email,
        registrationNumber: cpf,
        password: senha,
        phone: telefone || null,
      });

      setFeedback('sucesso');
      setNome('');
      setEmail('');
      setCPF('');
      setSenha('');
      setTelefone('');
      setErros({});
    } catch {
      setFeedback('erro');
    }

    setTimeout(() => setFeedback(null), 3000);
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.direita}>
        <Header titulo="Adicionar Leitor" nome="Bibliotecário" linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png" />
        <section className={styles.secao}>
          <h1 className={styles.tituloSection}>Adicionar</h1>

          {feedback === 'sucesso' && (
            <p style={{ color: 'green', marginBottom: 12, background: 'whitesmoke' }}>
              Leitor cadastrado com sucesso!
            </p>
          )}
          {feedback === 'erro' && (
            <p style={{ color: 'red', marginBottom: 12, background: 'whitesmoke' }}>
              Erro ao cadastrar. Tente novamente.
            </p>
          )}

          <form className={styles.gridFormulario} onSubmit={adicionarLeitor}>
            <div className={styles.campoMetade}>
              <label>Nome</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
              {erros.nome && <span style={{ color: 'red', fontSize: 12 }}>{erros.nome}</span>}
            </div>

            <div className={styles.campoMetade}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {erros.email && <span style={{ color: 'red', fontSize: 12 }}>{erros.email}</span>}
            </div>

            <div className={styles.campoMetade}>
              <label>CPF</label>
              <input type="text" value={cpf} onChange={(e) => setCPF(e.target.value)} />
              {erros.matricula && <span style={{ color: 'red', fontSize: 12 }}>{erros.cpf}</span>}
            </div>

            <div className={styles.campoMetade}>
              <label>Senha</label>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
              {erros.senha && <span style={{ color: 'red', fontSize: 12 }}>{erros.senha}</span>}
            </div>

            <div className={styles.campoMetade}>
              <label>Telefone (opcional)</label>
              <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
              {erros.telefone && <span style={{ color: 'red', fontSize: 12 }}>{erros.telefone}</span>}
            </div>

            <div className={styles.containerBotoes}>
              <button type="button" className={styles.btnCancelar} onClick={() => {
                setNome(''); setEmail(''); setCPF(''); setSenha(''); setTelefone(''); setErros({});
              }}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnAdicionar}>Adicionar Leitor</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CadastrarLeitor;