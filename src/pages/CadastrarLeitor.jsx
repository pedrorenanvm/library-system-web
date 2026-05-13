import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./CadastrarLeitor.module.css";
import { useState } from "react";

function CadastrarLeitor(){
    const[nome, setNome] = useState('');
    const[endereco, setEndereco] = useState('');
    const[cpf, setCpf] = useState('');
    const[numero, setNumero] = useState('');
    const [erros, setErros] = useState({})
    const [feedback, setFeedback] = useState(null)

    const validar = () => {
    const novosErros = {}

    if (!nome.trim())
      novosErros.nome = 'Nome é obrigatório'

    if (!endereco.trim())
      novosErros.endereco = 'Endereço é obrigatório'

    if (!cpf.trim())
      novosErros.cpf = 'CPF é obrigatório'
    else if (cpf.replace(/\D/g, '').length !== 11)
      novosErros.cpf = 'CPF deve ter 11 dígitos'

    if (!numero.trim())
      novosErros.numero = 'Número é obrigatório'
    else if (numero.replace(/\D/g, '').length !== 11)
      novosErros.numero = 'Numero inválido'

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function adicionarLeitor(e) {
    e.preventDefault()

    if (!validar()) return
    setFeedback('sucesso')
    setNome('')
    setEndereco('')
    setCpf('')
    setNumero('')
    setErros({})

    setTimeout(() => {
      setFeedback(null)
    }, 3000)
  }

    return(
        <div className={styles.container}>
            <Sidebar/>
            <main className={styles.direita}>
                <Header titulo={`Adicionar Leitor`} nome={`Bibliotecário`} linkImg={`https://img.icons8.com/ios-filled/100/ffffff/user.png`}/>
                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Adicionar</h1>

                     {feedback === 'sucesso' && (
                        <p style={{ color: 'green', marginBottom: 12, background:'whitesmoke' }}>
                            Leitor cadastrado com sucesso!
                        </p>
                     )}
                     {feedback === 'erro' && (
                        <p style={{ color: 'red', marginBottom: 12, background:'whitesmoke' }}>
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
                            <label>Endereço</label>
                            <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                             {erros.endereco && <span style={{ color: 'red', fontSize: 12 }}>{erros.endereco}</span>}
                        </div>

                        <div className={styles.campoMetade}>
                            <label>CPF</label>
                            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                             {erros.cpf && <span style={{ color: 'red', fontSize: 12 }}>{erros.cpf}</span>}
                        </div>

                        <div className={styles.campoMetade}>
                            <label>Numero</label>
                            <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} />
                             {erros.numero && <span style={{ color: 'red', fontSize: 12 }}>{erros.numero}</span>}
                        </div>

                        <div className={styles.containerBotoes}>
                            <button type="button" className={styles.btnCancelar}>Cancelar</button>
                            <button type="submit" className={styles.btnAdicionar}>Adicionar Leitor</button>
                        </div>
                    </form>
                </section>
            </main>
        </div>

    )
}

export default CadastrarLeitor