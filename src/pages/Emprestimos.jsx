import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./Emprestimos.module.css";
import { useState, useEffect } from "react";
import api from "../services/api";

function Emprestimos() {
    const [usuarios, setUsuarios] = useState([]);
    const [titulos, setTitulos] = useState([]);
    const [copias, setCopias] = useState([]);

    const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
    const [tituloSelecionado, setTituloSelecionado] = useState('');
    const [copiaSelecionada, setCopiaSelecionada] = useState('');

    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [erro, setErro] = useState('');

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [resUsuarios, resTitulos] = await Promise.all([
                    api.get('/v1/api/readers', { params: { page: 1, limit: 100 } }),
                    api.get('/v1/api/titles', { params: { page: 1, limit: 100 } }),
                ]);
                setUsuarios(resUsuarios.data.data);
                setTitulos(resTitulos.data.data);
            } catch {
                setErro('Erro ao carregar dados.');
            }
        };
        carregarDados();
    }, []);

    const handleTituloChange = async (e) => {
        const titleId = e.target.value;
        setTituloSelecionado(titleId);
        setCopiaSelecionada('');
        setCopias([]);
        setErro('');

        if (!titleId) return;

        try {
            const res = await api.get('/v1/api/copy', {
                params: { titleId, status: 'available', page: 1, limit: 100 }
            });
            setCopias(res.data.data);
            if (res.data.data.length === 0) setErro('Nenhuma cópia disponível para este título.');
        } catch {
            setErro('Erro ao buscar cópias.');
        }
    };

    const confirmarEmprestimo = async (e) => {
        e.preventDefault();
        setErro('');

        if (!usuarioSelecionado) return setErro('Selecione um usuário.');
        if (!copiaSelecionada) return setErro('Selecione uma cópia.');

        setCarregando(true);
        try {
            await api.post('/v1/api/loans', {
                userId: usuarioSelecionado,
                copyId: copiaSelecionada,
            });

            setFeedback('sucesso');
            setUsuarioSelecionado('');
            setTituloSelecionado('');
            setCopiaSelecionada('');
            setCopias([]);
        } catch {
            setFeedback('erro');
        } finally {
            setCarregando(false);
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.direita}>
                <Header
                    titulo="Novo empréstimo"
                    nome="Bibliotecário"
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png"
                />
                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Novo empréstimo</h1>

                    {feedback === 'sucesso' && (
                        <p style={{ color: 'green', background: 'whitesmoke', marginBottom: 12 }}>
                            Empréstimo realizado com sucesso!
                        </p>
                    )}
                    {feedback === 'erro' && (
                        <p style={{ color: 'red', background: 'whitesmoke', marginBottom: 12 }}>
                            Erro ao realizar empréstimo. Tente novamente.
                        </p>
                    )}
                    {erro && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{erro}</p>}

                    <form className={styles.gridFormulario} onSubmit={confirmarEmprestimo}>

                        <div className={styles.campoMetade}>
                            <label>Usuário</label>
                            <select
                                value={usuarioSelecionado}
                                onChange={(e) => setUsuarioSelecionado(e.target.value)}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            >
                                <option value="">Selecione um usuário</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} — {u.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.campoMetade}>
                            <label>Título do Livro</label>
                            <select
                                value={tituloSelecionado}
                                onChange={handleTituloChange}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            >
                                <option value="">Selecione um título</option>
                                {titulos.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} — {t.type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {copias.length > 0 && (
                            <div className={styles.campoInteiro}>
                                <label>Cópia disponível</label>
                                <select
                                    value={copiaSelecionada}
                                    onChange={(e) => setCopiaSelecionada(e.target.value)}
                                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                                >
                                    <option value="">Selecione uma cópia</option>
                                    {copias.map(c => (
                                        <option key={c.id} value={c.id}>
                                            Cód: {c.barcode}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className={styles.containerBotoes}>
                            <button
                                type="button"
                                className={styles.btnCancelar}
                                onClick={() => {
                                    setUsuarioSelecionado('');
                                    setTituloSelecionado('');
                                    setCopiaSelecionada('');
                                    setCopias([]);
                                    setErro('');
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={styles.btnAdicionar}
                                disabled={!usuarioSelecionado || !copiaSelecionada || carregando}
                                style={{ opacity: (!usuarioSelecionado || !copiaSelecionada) ? 0.5 : 1 }}
                            >
                                {carregando ? 'Confirmando...' : 'Confirmar Empréstimo'}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default Emprestimos;