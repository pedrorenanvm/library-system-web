import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./Emprestimos.module.css";
import { useState } from "react";

function Emprestimos() {
    const [usuario, setUsuario] = useState('');
    const [titulo, setTitulo] = useState('');
    const [copiaDisponivel, setCopiaDisponivel] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [erros, setErros] = useState({});
    const [feedback, setFeedback] = useState(null);

    const validar = () => {
        const novosErros = {};
        if (!usuario.trim()) novosErros.usuario = 'Usuário é obrigatório';
        if (!titulo.trim()) novosErros.titulo = 'Título é obrigatório';
        
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const verificarDisponibilidade = () => {
        if (!validar()) return;

        setCarregando(true);
        setTimeout(() => {
            const mockRespostaBanco = true;
            setCopiaDisponivel(mockRespostaBanco);
            setCarregando(false);
        }, 800);
    };

    function adicionarEmprestimo(e) {
        e.preventDefault();

        if (!validar()) return;
        
        if (!copiaDisponivel) {
            alert("Você precisa verificar a disponibilidade antes de finalizar.");
            return;
        }

        setFeedback('sucesso');
        setUsuario('');
        setTitulo('');
        setCopiaDisponivel(null);
        setErros({});

        setTimeout(() => {
            setFeedback(null);
        }, 3000);
    }

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.direita}>
                <Header 
                    titulo={`Novo empréstimo`} 
                    nome={`Bibliotecário`} 
                    linkImg={`https://img.icons8.com/ios-filled/100/ffffff/user.png`} 
                />
                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Novo empréstimo</h1>

                    {feedback === 'sucesso' && (
                        <p className={styles.mensagemFeedback}>
                            Empréstimo realizado com sucesso!
                        </p>
                    )}

                    <form className={styles.gridFormulario} onSubmit={adicionarEmprestimo}>
                        
                        <div className={styles.campoMetade}>
                            <label>Usuário</label>
                            <input 
                                type="text" 
                                value={usuario} 
                                onChange={(e) => {
                                    setUsuario(e.target.value);
                                    if(erros.usuario) setErros({...erros, usuario: null});
                                }} 
                            />
                            {erros.usuario && <span style={{ color: 'red', fontSize: 12 }}>{erros.usuario}</span>}
                        </div>

                        <div className={styles.campoMetade}>
                            <label>Título do Livro</label>
                            <input 
                                type="text" 
                                value={titulo} 
                                onChange={(e) => {
                                    setTitulo(e.target.value);
                                    setCopiaDisponivel(null); 
                                    if(erros.titulo) setErros({...erros, titulo: null});
                                }} 
                            />
                            {erros.titulo && <span style={{ color: 'red', fontSize: 12 }}>{erros.titulo}</span>}
                        </div>
                        
                        <div className={styles.campoInteiro}>
                            <button 
                                type="button" 
                                className={styles.btnVerificar} 
                                onClick={verificarDisponibilidade}
                                disabled={carregando}
                            >
                                {carregando ? 'Consultando...' : 'Verificar Disponibilidade'}
                            </button>
                            
                            {copiaDisponivel === true && (
                                <span style={{ color: 'green', marginLeft: '10px', fontSize: '14px' }}>
                                     Cópia disponível no sistema!
                                </span>
                            )}
                        </div>

                        <div className={styles.containerBotoes}>
                            <button type="button" className={styles.btnCancelar} onClick={() => {setUsuario(''); setTitulo('');}}>
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className={styles.btnAdicionar}
                                disabled={!copiaDisponivel}
                                style={{ opacity: copiaDisponivel ? 1 : 0.5 }}
                            >
                                Confirmar Empréstimo
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default Emprestimos;